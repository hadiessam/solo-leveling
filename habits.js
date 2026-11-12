/* =====================================================================
   SOLO LEVELING — UNIFIED DAILY HABITS & HISTORY ENGINE (v52)
   Strict Separation:
   - S.habitsToday   = Today's state ONLY (always unchecked at Cairo midnight)
   - S.habitHistory  = Permanent date-keyed history ({ date: { habitId: { habitId, date, completed, xpEarned } } })
   Zero mixing with S.daily. Zero fake streak fallbacks.
   ===================================================================== */

const HabitEngine = (function(){
  const XP_PER_HABIT = 10;
  const XP_ALL_BONUS = 25;

  function todayCairo(){
    return typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
  }

  function getHabitsList(){
    const base = (typeof HABIT_ROUTINES_DEF !== 'undefined' && Array.isArray(HABIT_ROUTINES_DEF))
      ? HABIT_ROUTINES_DEF
      : ((typeof HABITS !== 'undefined' && Array.isArray(HABITS)) ? HABITS : []);
    const custom = (typeof S !== 'undefined' && S && Array.isArray(S.customHabits)) ? S.customHabits : [];
    return base.concat(custom);
  }

  function getHabitById(habitId){
    return getHabitsList().find(h => h.id === habitId) || null;
  }

  function isDoneToday(habitId){
    if(typeof S === 'undefined' || !S || !S.habitsToday) return false;
    return !!S.habitsToday[habitId];
  }

  function getCompletedHistoryDates(habitId){
    const dates = [];
    if(typeof S === 'undefined' || !S) return dates;
    if(S.habitHistory && typeof S.habitHistory === 'object'){
      for(const dt in S.habitHistory){
        const dayBucket = S.habitHistory[dt];
        if(dayBucket && dayBucket[habitId] && dayBucket[habitId].completed){
          dates.push(dt);
        }
      }
    }
    return dates.sort();
  }

  function getHabitStats(habitId){
    const sortedDates = getCompletedHistoryDates(habitId);
    const today = todayCairo();
    const yesterday = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(today, -1) : '';

    let longest = 0;
    let run = 0;
    for(let i = 0; i < sortedDates.length; i++){
      if(i === 0){
        run = 1;
      } else {
        const gap = typeof SystemClock !== 'undefined'
          ? SystemClock.daysBetween(sortedDates[i - 1], sortedDates[i])
          : 1;
        run = (gap === 1) ? run + 1 : 1;
      }
      if(run > longest) longest = run;
    }

    let currentStreak = 0;
    if(sortedDates.length > 0){
      const latest = sortedDates[sortedDates.length - 1];
      if(latest === today || latest === yesterday){
        currentStreak = 1;
        for(let i = sortedDates.length - 2; i >= 0; i--){
          const gap = typeof SystemClock !== 'undefined'
            ? SystemClock.daysBetween(sortedDates[i], sortedDates[i + 1])
            : 1;
          if(gap === 1) currentStreak++;
          else break;
        }
      }
    }

    // Build 14-day history window
    const last14 = [];
    for(let i = 13; i >= 0; i--){
      const dt = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(today, -i) : today;
      const rec = S && S.habitHistory && S.habitHistory[dt] && S.habitHistory[dt][habitId];
      last14.push({
        date: dt,
        completed: !!(rec && rec.completed),
        xpEarned: rec ? (rec.xpEarned || 0) : 0
      });
    }

    return {
      totalCompletions: sortedDates.length,
      currentStreak: currentStreak,
      bestStreak: longest,
      lastCompletedDate: sortedDates.length ? sortedDates[sortedDates.length - 1] : null,
      last14: last14
    };
  }

  function toggleHabit(habitId, ev){
    if(ev && ev.stopPropagation) ev.stopPropagation();
    if(typeof S === 'undefined' || !S || !habitId) return false;
    if(typeof XpEngine !== 'undefined' && XpEngine.isActionLocked('habit:' + habitId)) return false;

    if(!S.habitsToday) S.habitsToday = {};
    if(!S.habitHistory) S.habitHistory = {};

    const today = todayCairo();
    const habit = getHabitById(habitId);
    const name = habit ? habit.name : habitId;
    const sourceId = `habit:${today}:${habitId}`;
    const bonusSourceId = `habit_all:${today}`;
    const wasDone = !!S.habitsToday[habitId];

    if(wasDone){
      delete S.habitsToday[habitId];
      if(S.habitHistory[today] && S.habitHistory[today][habitId]){
        delete S.habitHistory[today][habitId];
      }
      if(typeof XpEngine !== 'undefined'){
        XpEngine.reverseXP({
          sourceId: sourceId,
          stat: 'health',
          source: 'habit',
          type: 'HABIT_REVERSAL',
          reason: `Unchecked habit: ${name}`
        });
        // Also reverse full-habits bonus if previously earned today
        XpEngine.reverseXP({
          sourceId: bonusSourceId,
          stat: 'discipline',
          source: 'habit',
          type: 'HABIT_BONUS_REVERSAL',
          reason: 'All habits today bonus reversed'
        });
      }
      if(typeof sfx === 'function') sfx('uncheck');
      if(typeof log === 'function') log('HABIT UNCHECKED', `<b>${typeof esc === 'function' ? esc(name) : name}</b> unchecked.`);
    } else {
      if(!S.habitHistory[today]) S.habitHistory[today] = {};
      let gained = XP_PER_HABIT;
      if(typeof XpEngine !== 'undefined'){
        const res = XpEngine.grantXP({
          amount: XP_PER_HABIT,
          baseXP: XP_PER_HABIT,
          stat: 'health',
          source: 'habit',
          sourceId: sourceId,
          type: 'HABIT_COMPLETION',
          reason: `Daily Habit: ${name}`,
          applyMultiplier: false
        });
        if(res.granted) gained = res.finalXP;
      }

      S.habitsToday[habitId] = true;
      S.habitHistory[today][habitId] = {
        habitId: habitId,
        date: today,
        completed: true,
        xpEarned: gained
      };

      if(typeof sfx === 'function') sfx('success');
      if(ev && ev.clientX && typeof floatXP === 'function') floatXP(ev.clientX, ev.clientY, gained, false);
      if(typeof log === 'function') log('HABIT COMPLETE', `<b>${typeof esc === 'function' ? esc(name) : name}</b> (+${gained} XP).`);

      // Check if all habits done today -> award bonus once
      if(allDoneToday() && typeof XpEngine !== 'undefined'){
        const bRes = XpEngine.grantXP({
          amount: XP_ALL_BONUS,
          baseXP: XP_ALL_BONUS,
          stat: 'discipline',
          source: 'habit',
          sourceId: bonusSourceId,
          type: 'HABIT_ALL_BONUS',
          reason: 'Completed all daily habits today',
          isBonus: true
        });
        if(bRes.granted && typeof log === 'function'){
          log('ALL HABITS COMPLETE', `Every daily habit finished today! <b>+${bRes.finalXP} Bonus XP</b>.`);
        }
      }
    }

    if(typeof save === 'function') save();
    if(typeof drawHUD === 'function') drawHUD();
    if(typeof drawTab === 'function' && typeof currentActiveTab !== 'undefined'){
      drawTab(currentActiveTab || 'habits');
    }
    return true;
  }

  function addCustomHabit(name, timeOfDay = 'Day'){
    if(typeof S === 'undefined' || !S || !name || !name.trim()) return null;
    if(!Array.isArray(S.customHabits)) S.customHabits = [];
    const id = 'ch_' + Date.now();
    const habit = {
      id: id,
      name: name.trim(),
      category: timeOfDay + ' Routine',
      time: timeOfDay,
      timeOfDay: timeOfDay.toLowerCase(),
      why: 'Personal daily discipline habit.',
      custom: true
    };
    S.customHabits.push(habit);
    if(typeof save === 'function') save();
    if(typeof drawHabitsSection === 'function') drawHabitsSection();
    return id;
  }

  function removeCustomHabit(habitId){
    if(typeof S === 'undefined' || !S || !Array.isArray(S.customHabits)) return false;
    S.customHabits = S.customHabits.filter(h => h.id !== habitId);
    if(S.habitsToday) delete S.habitsToday[habitId];
    if(typeof save === 'function') save();
    if(typeof drawHabitsSection === 'function') drawHabitsSection();
    return true;
  }

  function getTodayCount(){
    const all = getHabitsList();
    return all.filter(h => isDoneToday(h.id)).length;
  }

  function allDoneToday(){
    const all = getHabitsList();
    return all.length > 0 && all.every(h => isDoneToday(h.id));
  }

  function getRecentHistoryRows(daysCount = 7){
    const today = todayCairo();
    const list = getHabitsList();
    const rows = [];
    for(let i = 0; i < daysCount; i++){
      const dt = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(today, -i) : today;
      const bucket = (typeof S !== 'undefined' && S && S.habitHistory && S.habitHistory[dt]) || {};
      const completedNames = list.filter(h => bucket[h.id] && bucket[h.id].completed).map(h => h.name);
      rows.push({
        date: dt,
        completedCount: completedNames.length,
        totalCount: list.length,
        completedNames: completedNames
      });
    }
    return rows;
  }

  return {
    XP_PER_HABIT,
    XP_ALL_BONUS,
    getHabitsList,
    getHabitById,
    isDoneToday,
    getHabitStats,
    toggleHabit,
    addCustomHabit,
    removeCustomHabit,
    getTodayCount,
    allDoneToday,
    getRecentHistoryRows
  };
})();

/* Unified Backward-Compatible Global Helpers */
const HABIT_TRACKER = {
  targetDays: 21,
  xpPerHabit: HabitEngine.XP_PER_HABIT,
  xpAllHabitsBonus: HabitEngine.XP_ALL_BONUS,
  isDoneToday: HabitEngine.isDoneToday,
  getTodayCount: HabitEngine.getTodayCount,
  allDoneToday: HabitEngine.allDoneToday
};
function toggleHabitRoutine(habitId, ev){ return HabitEngine.toggleHabit(habitId, ev); }
function checkHabit(habitId, ev){ return HabitEngine.toggleHabit(habitId, ev); }
function getHabitName(habitId){
  const h = HabitEngine.getHabitById(habitId);
  return h ? h.name : habitId;
}

if(typeof window !== 'undefined'){
  window.HabitEngine = HabitEngine;
  window.HABIT_TRACKER = HABIT_TRACKER;
  window.toggleHabitRoutine = toggleHabitRoutine;
  window.checkHabit = checkHabit;
  window.getHabitName = getHabitName;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = HabitEngine;
}
