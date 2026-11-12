/* =====================================================================
   SOLO LEVELING — UNIFIED TASK, DAILY ROTATION & ROLLOVER ENGINE (v52)
   Single Source of Truth for:
   - Deterministic Cairo-date Daily Missions (5-7 clear missions/day)
   - Task Completion & Exact XP Reversal (no double XP / no refresh exploits)
   - ONE Daily Rollover Engine (Africa/Cairo 00:00 AM, idempotent)
   - Missed Mission Penalties (-2x base XP, idempotent)
   - Accurate Daily History & Active-Day Streak Calculation
   ===================================================================== */

const TaskEngine = (function(){
  const DAILY_TARGET_COUNT = 6; // Sweet spot within 5-7 clear daily missions
  let _isRollingOver = false;
  let _schedulerStarted = false;
  let _midnightTimerId = null;
  let _safetyIntervalId = null;

  function todayCairo(){
    return typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
  }

  function hashString(str){
    let h = 2166136261;
    const s = String(str || '2026-11-12');
    for(let i = 0; i < s.length; i++){
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function normalizeTask(raw, sourceCategory = 'daily'){
    if(!raw) return null;
    const today = todayCairo();
    const isCompleted = !!(typeof S !== 'undefined' && S && S.daily && S.daily[raw.id]);
    return {
      id: raw.id,
      name: raw.name || raw.title || 'Daily Mission',
      title: raw.name || raw.title || 'Daily Mission',
      description: raw.desc || raw.description || '',
      sub: raw.sub || raw.category || 'Productivity',
      type: raw.type || sourceCategory,
      category: raw.stat || raw.category || 'career',
      priority: raw.priority || 'medium',
      xp: Number(raw.xp) || 20,
      duration: raw.duration || '20 min',
      steps: raw.steps || [],
      isCustom: !!raw.isCustom || String(raw.id).startsWith('ct_'),
      completedAt: isCompleted ? (S.daily[raw.id] || today) : null
    };
  }

  function getPool(){
    if(typeof DAILY_MISSIONS_POOL !== 'undefined' && Array.isArray(DAILY_MISSIONS_POOL) && DAILY_MISSIONS_POOL.length){
      return DAILY_MISSIONS_POOL;
    }
    if(typeof INTELLIGENT_QUESTS_POOL !== 'undefined' && Array.isArray(INTELLIGENT_QUESTS_POOL) && INTELLIGENT_QUESTS_POOL.length){
      return INTELLIGENT_QUESTS_POOL;
    }
    if(typeof DAILY !== 'undefined' && Array.isArray(DAILY)) return DAILY;
    return [];
  }

  function findTaskDefinition(taskId){
    if(!taskId) return null;
    if(typeof S !== 'undefined' && S && Array.isArray(S.customTasks)){
      const ct = S.customTasks.find(t => t.id === taskId);
      if(ct) return normalizeTask(ct, 'custom');
    }
    const pool = getPool();
    const pMatch = pool.find(t => t.id === taskId);
    if(pMatch) return normalizeTask(pMatch, 'daily');

    if(typeof DAILY !== 'undefined'){
      const dMatch = DAILY.find(t => t.id === taskId);
      if(dMatch) return normalizeTask(dMatch, 'daily');
    }
    if(typeof WEEKLY !== 'undefined'){
      const wMatch = WEEKLY.find(t => t.id === taskId);
      if(wMatch) return normalizeTask(wMatch, 'weekly');
    }
    return null;
  }

  /* -------------------------------------------------------------------
     DETERMINISTIC DAILY MISSION ROTATION (5-7 Clear Balanced Missions)
     Same Cairo day + refresh = EXACT SAME missions.
     Next Cairo day = fresh balanced set (never identical to yesterday).
     ------------------------------------------------------------------- */
  function getDailyMissions(dateStr, forceRegenerate){
    const targetDate = dateStr || todayCairo();
    const pool = getPool();
    if(!pool.length) return [];

    // 1. If already generated for targetDate, return exact cached list + active custom tasks
    if(!forceRegenerate && typeof S !== 'undefined' && S && S.dailyMissions && S.dailyMissions.date === targetDate && Array.isArray(S.dailyMissions.ids) && S.dailyMissions.ids.length >= 5){
      const resolved = S.dailyMissions.ids
        .map(id => findTaskDefinition(id))
        .filter(Boolean);
      if(resolved.length >= 5){
        return appendCustomAndCompleted(resolved);
      }
    }

    // 2. Deterministic date-based selection
    const yesterdayKey = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(targetDate, -1) : '';
    const yesterdayIds = new Set(
      (typeof S !== 'undefined' && S && S.dailyHistory && S.dailyHistory[yesterdayKey] && S.dailyHistory[yesterdayKey].missionIds) ||
      (typeof S !== 'undefined' && S && S.dailyMissions && S.dailyMissions.date !== targetDate ? S.dailyMissions.ids : []) ||
      []
    );

    const seed = hashString(targetDate);
    const ranked = pool.map((m, idx) => ({
      m,
      score: ((idx * 2654435761) ^ seed) >>> 0
    })).sort((a, b) => a.score - b.score).map(x => x.m);

    // Ensure healthy daily category balance across 6 missions
    const pillarFilters = [
      m => m.sub === 'English',
      m => m.sub === 'Learning',
      m => m.sub === 'Career' || m.sub === 'Projects',
      m => m.sub === 'Health',
      m => m.sub === 'Skills',
      m => m.sub === 'Reading' || m.sub === 'Productivity' || m.sub === 'Discipline'
    ];

    const selected = [];
    const usedIds = new Set();

    // First pass: prefer missions NOT in yesterday's list
    pillarFilters.forEach(pred => {
      const match = ranked.find(m => pred(m) && !usedIds.has(m.id) && !yesterdayIds.has(m.id))
                 || ranked.find(m => pred(m) && !usedIds.has(m.id));
      if(match){
        selected.push(match);
        usedIds.add(match.id);
      }
    });

    // Top up to DAILY_TARGET_COUNT (6) if any category lacked candidates
    for(let i = 0; i < ranked.length && selected.length < DAILY_TARGET_COUNT; i++){
      if(!usedIds.has(ranked[i].id) && !yesterdayIds.has(ranked[i].id)){
        selected.push(ranked[i]);
        usedIds.add(ranked[i].id);
      }
    }
    for(let i = 0; i < ranked.length && selected.length < DAILY_TARGET_COUNT; i++){
      if(!usedIds.has(ranked[i].id)){
        selected.push(ranked[i]);
        usedIds.add(ranked[i].id);
      }
    }

    if(typeof S !== 'undefined' && S){
      S.dailyMissions = {
        date: targetDate,
        ids: selected.map(m => m.id)
      };
    }

    return appendCustomAndCompleted(selected.map(m => normalizeTask(m, 'daily')));
  }

  function appendCustomAndCompleted(baseList){
    const result = baseList.slice();
    const seen = new Set(result.map(t => t.id));
    if(typeof S !== 'undefined' && S){
      // Add active custom tasks marked for today (up to +2 max cleanly)
      if(Array.isArray(S.customTasks)){
        S.customTasks.forEach(ct => {
          if(!ct.archived && (ct.status === 'today' || (S.daily && S.daily[ct.id])) && !seen.has(ct.id) && result.length < 8){
            result.push(normalizeTask(ct, 'custom'));
            seen.add(ct.id);
          }
        });
      }
      // Keep any task already completed today visible
      if(S.daily){
        Object.keys(S.daily).forEach(id => {
          if(!seen.has(id)){
            const def = findTaskDefinition(id);
            if(def && def.type !== 'weekly'){
              result.push(def);
              seen.add(id);
            }
          }
        });
      }
    }
    return result;
  }

  /* -------------------------------------------------------------------
     DAILY HISTORY & LIVE STREAK SYNCHRONIZATION (Single Source of Truth)
     Reads strictly today's Daily Missions & updates S.dailyHistory[today].
     ------------------------------------------------------------------- */
  function syncTodayHistory(){
    if(typeof S === 'undefined' || !S) return null;
    const today = todayCairo();
    const missions = getDailyMissions(today);
    if(!S.daily) S.daily = {};
    if(!S.dailyHistory) S.dailyHistory = {};

    const missionIds = missions.map(m => m.id);
    const completedIds = missions.filter(m => !!S.daily[m.id]).map(m => m.id);
    const missionsCompleted = completedIds.length;
    const missionsTotal = missions.length;
    const activeDay = missionsCompleted >= 1;

    const todayXP = (typeof XpEngine !== 'undefined' && XpEngine.getAnalytics)
      ? XpEngine.getAnalytics().today
      : 0;

    S.dailyHistory[today] = {
      date: today,
      missionsCompleted: missionsCompleted,
      missionsTotal: missionsTotal,
      completedIds: completedIds,
      missionIds: missionIds,
      xpEarned: todayXP,
      activeDay: activeDay
    };

    // Sync S.log30 compatibility cleanly
    if(!S.log30) S.log30 = {};
    S.log30[today] = {
      done: missionsCompleted,
      total: missionsTotal,
      xp: S.xp,
      level: S.level
    };

    // Immediate Streak Integrity Sync (No double counting)
    if(activeDay){
      if(S.lastStreakDate !== today){
        S._prevStreakDateBeforeToday = S.lastStreakDate || '';
        S.streak = (S.streak || 0) + 1;
        S.best = Math.max(S.best || 0, S.streak);
        S.lastStreakDate = today;
        S.lastActive = today;
      }
    } else {
      // If user unchecked their only completed task today, revert today's increment cleanly
      if(S.lastStreakDate === today){
        S.streak = Math.max(0, (S.streak || 1) - 1);
        S.lastStreakDate = S._prevStreakDateBeforeToday || '';
      }
    }

    return S.dailyHistory[today];
  }

  /* -------------------------------------------------------------------
     UNIFIED TASK TOGGLE HANDLER
     ------------------------------------------------------------------- */
  function toggleTask(taskId, ev){
    if(ev && ev.stopPropagation) ev.stopPropagation();
    if(!taskId || typeof S === 'undefined' || !S) return false;

    if(typeof XpEngine !== 'undefined' && XpEngine.isActionLocked((S.daily && S.daily[taskId] ? 'uncheck:' : 'check:') + taskId)){
      return false;
    }

    if(!S.daily) S.daily = {};
    if(!S.taskStatus) S.taskStatus = {};
    if(!S.taskXP) S.taskXP = {};

    const task = findTaskDefinition(taskId) || { id: taskId, title: 'Daily Mission', xp: 20, category: 'career' };
    const today = todayCairo();
    const sourceId = `task:${today}:${taskId}`;
    const isDone = !!S.daily[taskId];

    if(isDone){
      // UNCHECK: Reverse exact XP & update history
      delete S.daily[taskId];
      S.taskStatus[taskId] = 'today';
      if(S.customTasks){
        const ct = S.customTasks.find(t => t.id === taskId);
        if(ct) ct.status = 'today';
      }

      const prevGain = typeof S.taskXP[taskId] === 'number' ? S.taskXP[taskId] : undefined;
      if(typeof XpEngine !== 'undefined'){
        XpEngine.reverseXP({
          sourceId: sourceId,
          amount: prevGain,
          stat: task.category,
          source: 'mission',
          type: 'TASK_REVERSAL',
          reason: task.title
        });
      }
      delete S.taskXP[taskId];
      S.qDone = Math.max(0, (S.qDone || 0) - 1);
      syncTodayHistory();

      if(typeof sfx === 'function') sfx('uncheck');
      if(typeof SystemEvents !== 'undefined') SystemEvents.emit('TASK_REOPENED', { taskId, title: task.title });
      if(typeof log === 'function') log('MISSION REOPENED', `<b>${typeof esc === 'function' ? esc(task.title) : task.title}</b> unchecked.`);
    } else {
      // COMPLETE: Mark completed, grant exact XP once, update history & streak
      if(!S.started){
        S.started = true;
        S.startedOn = today;
      }

      S.daily[taskId] = today;
      S.taskStatus[taskId] = 'completed';
      if(S.customTasks){
        const ct = S.customTasks.find(t => t.id === taskId);
        if(ct) ct.status = 'completed';
      }

      let finalXP = task.xp;
      if(typeof XpEngine !== 'undefined'){
        const res = XpEngine.grantXP({
          amount: task.xp,
          baseXP: task.xp,
          stat: task.category,
          source: 'mission',
          sourceId: sourceId,
          type: 'TASK_COMPLETION',
          reason: task.title,
          applyMultiplier: true
        });
        if(!res.granted){
          return false;
        }
        finalXP = res.finalXP;
      }

      S.taskXP[taskId] = finalXP;
      S.qDone = (S.qDone || 0) + 1;
      S.lastActive = today;

      if(taskId === 'q_bassem_daily' && typeof logBassemStudySession === 'function'){
        if(S.bassem && S.bassem.todayMinutes < 60){
          logBassemStudySession(60);
        }
      }

      syncTodayHistory();

      if(typeof sfx === 'function') sfx('mission');
      if(ev && ev.clientX && typeof floatXP === 'function') floatXP(ev.clientX, ev.clientY, finalXP, false);
      if(typeof growShadow === 'function') growShadow();
      if(typeof SystemEvents !== 'undefined') SystemEvents.emit('TASK_COMPLETED', { taskId, title: task.title, xp: finalXP });
      if(typeof log === 'function') log('MISSION COMPLETE', `<b>${typeof esc === 'function' ? esc(task.title) : task.title}</b> cleared. <b>+${finalXP} XP</b>.`);
    }

    if(typeof save === 'function') save();
    // Targeted lightweight update instead of rebuilding every hidden page
    if(typeof drawHUD === 'function') drawHUD();
    if(typeof drawTab === 'function' && typeof currentActiveTab !== 'undefined'){
      drawTab(currentActiveTab || 'dash');
    } else if(typeof renderAll === 'function'){
      renderAll();
    }
    return true;
  }

  /* 1 Free Daily Quest Reroll */
  function rerollTask(taskId){
    if(typeof S === 'undefined' || !S || !taskId) return false;
    if((S.questRerollsRemaining || 0) <= 0){
      if(typeof alert === 'function') alert('No quest rerolls remaining today. Resets at Cairo midnight.');
      return false;
    }
    const today = todayCairo();
    const pool = getPool();
    const currentIds = new Set((S.dailyMissions && S.dailyMissions.ids) || []);
    const replacement = pool.find(m => !currentIds.has(m.id));
    if(!replacement) return false;

    if(S.dailyMissions && Array.isArray(S.dailyMissions.ids)){
      const idx = S.dailyMissions.ids.indexOf(taskId);
      if(idx !== -1){
        S.dailyMissions.ids[idx] = replacement.id;
      }
    }
    S.questRerollsRemaining = Math.max(0, (S.questRerollsRemaining || 1) - 1);
    syncTodayHistory();
    if(typeof sfx === 'function') sfx('loot');
    if(typeof log === 'function') log('QUEST REROLLED', `Swapped daily mission for <b>${replacement.name}</b>.`);
    if(typeof save === 'function') save();
    if(typeof renderAll === 'function') renderAll();
    return true;
  }

  /* -------------------------------------------------------------------
     ONE AUTHORITATIVE DAILY ROLLOVER ENGINE
     Idempotent. Cairo timezone. Archives history, calculates streak,
     applies -2x baseXP penalty for missed missions once, resets today's
     tasks/habits, and rotates daily missions & 15 vocab words.
     ------------------------------------------------------------------- */
  function processDailyRollover(options = {}){
    const s = options.stateOverride || (typeof S !== 'undefined' ? S : null);
    if(!s) return { rolledOver: false };
    if(_isRollingOver && !options.stateOverride) return { rolledOver: false };

    const today = options.todayOverride || todayCairo();
    const lastProcessed = s.lastProcessedDate || s.lastDay || '';

    // Ensure today's daily missions & vocabulary exist even on first init
    if(!lastProcessed){
      s.lastProcessedDate = today;
      s.lastDay = today;
      if(!options.stateOverride){
        getDailyMissions(today, false);
        if(typeof generateDailyVocabulary === 'function') generateDailyVocabulary(today, false);
        syncTodayHistory();
      }
      return { rolledOver: false, initialized: true };
    }

    // Idempotent guard: already processed this Cairo date!
    if(lastProcessed === today && !options.force){
      if(!options.stateOverride){
        getDailyMissions(today, false);
        if(typeof generateDailyVocabulary === 'function') generateDailyVocabulary(today, false);
        syncTodayHistory();
      }
      return { rolledOver: false };
    }

    _isRollingOver = true;
    try{
      // Swap global S temporarily if testing with stateOverride
      const prevGlobalS = typeof S !== 'undefined' ? S : null;
      if(options.stateOverride && typeof global !== 'undefined') global.S = s;

      console.log(`[DailyRollover] Cairo date rollover: ${lastProcessed} -> ${today}`);

      // 1. Evaluate previous active day's missions ONLY
      if(!s.dailyHistory) s.dailyHistory = {};
      if(!s.penaltyLog) s.penaltyLog = {};

      let prevMissionObjs = [];
      if(s.dailyMissions && s.dailyMissions.date === lastProcessed && Array.isArray(s.dailyMissions.ids)){
        prevMissionObjs = s.dailyMissions.ids.map(id => findTaskDefinition(id)).filter(Boolean);
      } else if(Array.isArray(options.prevMissions)){
        prevMissionObjs = options.prevMissions;
      } else {
        prevMissionObjs = getDailyMissions(lastProcessed, false);
      }

      const prevDailyMap = s.daily || {};
      const completedIds = prevMissionObjs.filter(m => !!prevDailyMap[m.id]).map(m => m.id);
      const missedMissions = prevMissionObjs.filter(m => !prevDailyMap[m.id]);
      const activeDay = completedIds.length >= 1 || Object.keys(prevDailyMap).length >= 1;

      // 2. Apply Missed Mission Penalty (-2x base XP per missed mission, strictly idempotent)
      let penaltiesAppliedCount = 0;
      let totalPenaltyXP = 0;
      if(s.started && !s.paused && missedMissions.length > 0 && typeof XpEngine !== 'undefined'){
        missedMissions.forEach(m => {
          const pRes = XpEngine.applyPenalty({
            baseXP: m.xp || 20,
            sourceId: `${lastProcessed}:${m.id}`,
            date: lastProcessed,
            reason: `Missed mission (${lastProcessed}): ${m.name || m.title}`
          });
          if(pRes.applied){
            penaltiesAppliedCount++;
            totalPenaltyXP += pRes.penaltyXP;
          }
        });
      }

      // 3. Record archived dailyHistory entry for lastProcessed
      s.dailyHistory[lastProcessed] = {
        date: lastProcessed,
        missionsCompleted: completedIds.length,
        missionsTotal: prevMissionObjs.length,
        completedIds: completedIds,
        missionIds: prevMissionObjs.map(m => m.id),
        xpEarned: (s.dailyHistory[lastProcessed] && s.dailyHistory[lastProcessed].xpEarned) || 0,
        penaltiesApplied: totalPenaltyXP,
        activeDay: activeDay
      };

      if(!s.log30) s.log30 = {};
      s.log30[lastProcessed] = {
        done: completedIds.length,
        total: prevMissionObjs.length,
        xp: s.xp,
        level: s.level
      };

      // 4. Streak evaluation for yesterday
      if(s.started && !s.paused){
        if(!activeDay){
          s.streak = 0;
          s.lastStreakDate = '';
        } else if(s.lastStreakDate !== lastProcessed){
          s.streak = (s.streak || 0) + 1;
          s.best = Math.max(s.best || 0, s.streak);
          s.lastStreakDate = lastProcessed;
        }
      }

      // 5. Reset today's volatile daily states (Habits become unchecked, Missions reset, History stays safe!)
      s.daily = {};
      s.taskXP = {};
      s.habitsToday = {};
      s.rerolledTasks = {};
      s.questRerollsRemaining = 1;
      s.vocabExtraWordsCount = 0;
      s.lastProcessedDate = today;
      s.lastDay = today;

      // Also check Weekly Reset (Egypt week starts Friday)
      const curWeek = typeof SystemClock !== 'undefined' ? SystemClock.weekKey(new Date()) : today;
      if(s.lastWeek && s.lastWeek !== curWeek){
        s.weekly = {};
        s.weeklyBoss = {};
        s.lastWeek = curWeek;
      } else if(!s.lastWeek){
        s.lastWeek = curWeek;
      }

      // 6. Generate fresh daily missions & fresh 15 daily vocab words for today
      const newMissions = getDailyMissions(today, true);
      if(typeof generateDailyVocabulary === 'function'){
        generateDailyVocabulary(today, true);
      }

      s.dailyHistory[today] = {
        date: today,
        missionsCompleted: 0,
        missionsTotal: newMissions.length,
        completedIds: [],
        missionIds: newMissions.map(m => m.id),
        xpEarned: 0,
        penaltiesApplied: 0,
        activeDay: false
      };

      if(!options.stateOverride){
        if(typeof save === 'function') save();
        if(typeof StorageManager !== 'undefined' && StorageManager.createSnapshot){
          StorageManager.createSnapshot('Rollover-' + today, s).catch(()=>{});
        }
        if(typeof SystemEvents !== 'undefined'){
          SystemEvents.emit('DAY_ROLLOVER', { prevDate: lastProcessed, date: today, streak: s.streak, penalties: totalPenaltyXP });
        }
        if(typeof log === 'function'){
          const summaryMsg = activeDay
            ? `New Cairo day (${today}) started! Yesterday: ${completedIds.length}/${prevMissionObjs.length} cleared.`
            : `New Cairo day (${today}) started. Yesterday had 0 missions completed (Missed Day).`;
          log('NEW DAY', summaryMsg);
        }
        if(!options.quiet && typeof sfx === 'function') sfx('boot');
        if(typeof renderEverything === 'function') renderEverything();
      }

      if(options.stateOverride && typeof global !== 'undefined' && prevGlobalS !== null){
        global.S = prevGlobalS;
      }

      return {
        rolledOver: true,
        prevDate: lastProcessed,
        newDate: today,
        prevCompleted: completedIds.length,
        prevTotal: prevMissionObjs.length,
        activeDay: activeDay,
        streak: s.streak,
        penaltiesAppliedCount: penaltiesAppliedCount,
        totalPenaltyXP: totalPenaltyXP,
        newMissionsCount: newMissions.length
      };
    } finally {
      _isRollingOver = false;
    }
  }

  /* -------------------------------------------------------------------
     CENTRALIZED MIDNIGHT SCHEDULER (Cairo 00:00 AM without Refresh)
     Triggers: startup, exact Cairo midnight timeout, 60s safety net,
     visibilitychange, focus, online.
     ------------------------------------------------------------------- */
  function scheduleExactMidnight(){
    if(_midnightTimerId) clearTimeout(_midnightTimerId);
    const ms = typeof SystemClock !== 'undefined' ? SystemClock.msUntilCairoMidnight() : 60000;
    _midnightTimerId = setTimeout(() => {
      processDailyRollover({ quiet: false });
      scheduleExactMidnight();
    }, ms);
  }

  function startDailyScheduler(){
    processDailyRollover({ quiet: true });
    if(_schedulerStarted || typeof window === 'undefined') return;
    _schedulerStarted = true;

    scheduleExactMidnight();
    _safetyIntervalId = setInterval(() => { processDailyRollover({ quiet: false }); }, 60 * 1000);

    document.addEventListener('visibilitychange', () => {
      if(!document.hidden){
        const r = processDailyRollover({ quiet: false });
        if(r.rolledOver) scheduleExactMidnight();
      }
    });
    window.addEventListener('focus', () => {
      processDailyRollover({ quiet: true });
    });
    window.addEventListener('online', () => {
      processDailyRollover({ quiet: false });
    });
  }

  return {
    DAILY_TARGET_COUNT,
    normalizeTask,
    findTaskDefinition,
    getDailyMissions,
    syncTodayHistory,
    toggleTask,
    rerollTask,
    processDailyRollover,
    startDailyScheduler
  };
})();

/* Route legacy entry points cleanly to the single TaskEngine */
window.getDailyPriorities = function(){
  return TaskEngine.getDailyMissions();
};
window.toggleLifeOSTask = function(taskId, ev){
  return TaskEngine.toggleTask(taskId, ev);
};
window.toggleMission = function(kind, id, ev){
  if(kind === 'daily') return TaskEngine.toggleTask(id, ev);
  // Weekly mission toggle remains separate from daily
  if(typeof toggleWeeklyMission === 'function') return toggleWeeklyMission(id, ev);
  return false;
};
window.resets = function(){
  return TaskEngine.processDailyRollover({ quiet: true });
};

if(typeof window !== 'undefined'){
  window.TaskEngine = TaskEngine;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = TaskEngine;
}
