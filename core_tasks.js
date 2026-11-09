/* =====================================================================
   SOLO LEVELING — UNIFIED TASK ENGINE & DAILY ROLLOVER ENGINE
   Unified task schema, legacy adapters, anti-duplication toggle,
   Cairo timezone daily rollover, and targeted reactive updates.
   ===================================================================== */

const TaskEngine = (function(){

  /* Normalize any task into standard Life OS task representation */
  function normalizeTask(raw, sourceCategory = 'task'){
    if(!raw) return null;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    const isCompleted = !!(S.daily && S.daily[raw.id]) || (S.taskStatus && S.taskStatus[raw.id] === 'completed');

    return {
      id: raw.id,
      legacyId: raw.legacyId || raw.id,
      title: raw.name || raw.title || 'Untitled Task',
      description: raw.desc || raw.description || raw.sub || '',
      type: raw.type || (raw.id.startsWith('w') ? 'weekly' : (raw.id.startsWith('d') ? 'daily' : sourceCategory)),
      category: raw.stat || raw.category || 'career',
      priority: raw.priority || 'medium',
      difficulty: raw.level || 1,
      xp: raw.xp || 25,
      duration: raw.duration || '20 min',
      status: isCompleted ? 'completed' : ((S.taskStatus && S.taskStatus[raw.id]) || 'today'),
      relatedGoal: raw.related || raw.relatedGoal || '',
      requiresSaudiPhone: !!raw.requiresSaudiPhone,
      steps: raw.steps || [],
      criteria: raw.criteria || '',
      outcome: raw.outcome || '',
      createdAt: raw.createdAt || today,
      completedAt: isCompleted ? (S.daily[raw.id] || today) : null
    };
  }

  /* Find a task definition anywhere in the system */
  function findTaskDefinition(taskId){
    if(!taskId) return null;
    // 1. Custom tasks
    if(S.customTasks && S.customTasks.length){
      const ct = S.customTasks.find(t => t.id === taskId);
      if(ct) return normalizeTask(ct, 'custom');
    }
    // 2. Intelligent quests pool
    if(typeof INTELLIGENT_QUESTS_POOL !== 'undefined'){
      const q = INTELLIGENT_QUESTS_POOL.find(t => t.id === taskId);
      if(q) return normalizeTask(q, 'daily_quest');
    }
    // 3. Recovery tasks
    if(typeof RECOVERY_TASKS_DEF !== 'undefined'){
      const r = RECOVERY_TASKS_DEF.find(t => t.id === taskId);
      if(r) return normalizeTask(r, 'recovery');
    }
    // 4. Habit routines
    if(typeof HABIT_ROUTINES_DEF !== 'undefined'){
      const h = HABIT_ROUTINES_DEF.find(t => t.id === taskId);
      if(h) return normalizeTask(h, 'habit_routine');
    }
    // 5. Active daily tasks
    if(typeof ACTIVE_DAILY_TASKS_DEF !== 'undefined'){
      const a = ACTIVE_DAILY_TASKS_DEF.find(t => t.id === taskId);
      if(a) return normalizeTask(a, 'daily');
    }
    // 6. Legacy DAILY
    if(typeof DAILY !== 'undefined'){
      const d = DAILY.find(t => t.id === taskId);
      if(d) return normalizeTask(d, 'legacy_daily');
    }
    // 7. Legacy WEEKLY
    if(typeof WEEKLY !== 'undefined'){
      const w = WEEKLY.find(t => t.id === taskId);
      if(w) return normalizeTask(w, 'weekly');
    }

    return null;
  }

  /* Unified Task Toggle Handler */
  function toggleTask(taskId, ev){
    if(ev && ev.stopPropagation) ev.stopPropagation();
    if(!taskId || typeof S === 'undefined' || !S) return false;

    // Fast anti-spam click lock
    if(typeof XpEngine !== 'undefined' && XpEngine.isActionLocked(taskId)){
      return false;
    }

    if(!S.daily) S.daily = {};
    if(!S.taskStatus) S.taskStatus = {};

    const task = findTaskDefinition(taskId) || { id: taskId, title: 'Task', xp: 25, category: 'career' };
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    const isDone = !!S.daily[taskId];

    if(isDone){
      // Reopen task
      delete S.daily[taskId];
      S.taskStatus[taskId] = 'today';
      if(S.customTasks){
        const ct = S.customTasks.find(t => t.id === taskId);
        if(ct) ct.status = 'today';
      }
      if(typeof sfx === 'function') sfx('uncheck');

      // Reverse gold
      const goldAmt = ((S.taskXP && S.taskXP[taskId] != null) ? S.taskXP[taskId] : task.xp) * 2;
      S.gold = Math.max(0, (S.gold || 0) - goldAmt);

      const xpGain = (S.taskXP && S.taskXP[taskId] != null) ? S.taskXP[taskId] : task.xp;
      if(typeof XpEngine !== 'undefined'){
        XpEngine.reverseXP({ amount: xpGain, stat: task.category, source: 'task', sourceId: taskId, reason: task.title });
      }
      if(S.taskXP) delete S.taskXP[taskId];
      S.qDone = Math.max(0, (S.qDone || 0) - 1);

      if(typeof SystemEvents !== 'undefined'){
        SystemEvents.emit('TASK_REOPENED', { taskId, title: task.title });
      }
      if(typeof log === 'function') log('TASK REOPENED', `<b>${esc(task.title)}</b> returned to active.`);
    } else {
      // Complete task
      if(!S.started){
        S.started = true;
        S.startedOn = today;
        S.streak = Math.max(S.streak || 0, 1);
        S.best = Math.max(S.best || 0, 1);
        S.lastActive = today;
        if(typeof sfx === 'function') sfx('boot');
      }

      S.daily[taskId] = today;
      S.taskStatus[taskId] = 'completed';
      if(S.customTasks){
        const ct = S.customTasks.find(t => t.id === taskId);
        if(ct) ct.status = 'completed';
      }
      S.qDone = (S.qDone || 0) + 1;
      S.lastActive = today;
      if(typeof sfx === 'function') sfx('check');

      const xpGain = task.xp || 25;
      let finalXP = xpGain;
      if(typeof XpEngine !== 'undefined'){
        finalXP = XpEngine.grantXP({
          amount: xpGain,
          stat: task.category,
          source: 'task',
          sourceId: taskId,
          reason: task.title
        });
      }
      if(!S.taskXP) S.taskXP = {};
      S.taskXP[taskId] = finalXP;

      // Award gold immediately (immediate credit rule)
      const goldEarned = Number(finalXP) * 2;
      S.gold = (S.gold || 0) + goldEarned;

      // Special Bassem School check if completed via task list
      if(taskId === 'q_bassem_daily' && typeof logBassemStudySession === 'function'){
        if(S.bassem && S.bassem.todayMinutes < 60){
          logBassemStudySession(60);
        }
      }

      if(typeof SystemEvents !== 'undefined'){
        SystemEvents.emit('TASK_COMPLETED', { taskId, title: task.title, xp: finalXP, gold: goldEarned });
      }
      if(typeof log === 'function') log('TASK COMPLETE', `<b>${esc(task.title)}</b> cleared. <b>+${finalXP} XP</b> &middot; <b>+${goldEarned} Gold</b>.`);
      if(ev && typeof floatXP === 'function') floatXP(ev.clientX, ev.clientY, finalXP, false);
    }

    if(typeof save === 'function') save();
    if(typeof renderDashboard === 'function') renderDashboard();
    else if(typeof renderAll === 'function') renderAll();

    return true;
  }

  /* 1 Free Daily Quest Reroll per Day */
  function rerollTask(taskId){
    if(!S || !taskId) return false;
    if((S.questRerollsRemaining || 0) <= 0){
      alert('No quest rerolls remaining today! Resets at Cairo midnight.');
      return false;
    }
    if(!S.rerolledTasks) S.rerolledTasks = {};
    S.rerolledTasks[taskId] = true;
    S.questRerollsRemaining = Math.max(0, (S.questRerollsRemaining || 1) - 1);
    
    if(typeof sfx === 'function') sfx('loot');
    if(typeof log === 'function') log('QUEST REROLLED', 'Daily Quest rerolled into a fresh objective!');
    if(typeof save === 'function') save();
    if(typeof renderEverything === 'function') renderEverything();
    return true;
  }

  /* Centralized Daily Rollover Engine — Tiered Evaluation System */
  function processDailyRollover(stateOverride){
    const s = stateOverride || (typeof S !== 'undefined' ? S : null);
    if(!s) return null;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    if(!s.lastDay) s.lastDay = '2026-01-01';

    let result = { streak: s.streak, tier: 'protected', bonusStatPoints: 0, streakPreserved: true };

    // Check if day has turned in Cairo timezone or explicit stateOverride
    if(s.lastDay !== today || stateOverride){
      console.log(`[DailyRollover] Advancing day from ${s.lastDay} to ${today}...`);

      // 1. Calculate tasks completed on the previous day
      const dailyPriorities = typeof getDailyPriorities === 'function' ? getDailyPriorities() : [];
      const totalAvailable = dailyPriorities.length > 0 ? dailyPriorities.length : Math.max(1, Object.keys(s.daily || {}).length);
      const completedYesterday = Object.keys(s.daily || {}).length;
      let pct = totalAvailable > 0 ? (completedYesterday / totalAvailable) : 0;
      if(stateOverride && typeof stateOverride.dailyCompletedRatio === 'number'){
        pct = stateOverride.dailyCompletedRatio;
      }

      // Tiered Evaluation Rules (Fixes all-or-nothing reset)
      if(pct >= 1.0){
        // Tier 4: S-Rank Perfect Clear (100% completed)
        s.streak = (s.streak || 0) + 1;
        s.best = Math.max(s.best || 0, s.streak);
        const bonusXP = Math.round((s.xp || 8028) * 0.025); // +25% day bonus
        if(typeof XpEngine !== 'undefined' && XpEngine.grantXP){
          XpEngine.grantXP({ amount: bonusXP, isBonus: true, source: 's_rank_clear', reason: 'S-Rank Perfect Clear Bonus' });
        } else {
          s.xp = (s.xp || 0) + bonusXP;
        }
        s.statPoints = (s.statPoints || 0) + 1;
        s.gold = (s.gold || 0) + 250;
        result = { streak: s.streak, tier: 's_rank', bonusStatPoints: 1, streakPreserved: true };
        if(typeof log === 'function') log('S-RANK PERFECT CLEAR', `All daily objectives cleared! Streak: <b>${s.streak} Days</b>! +\${bonusXP} XP & +1 Stat Point!`);
      } else if(pct >= 0.50 || completedYesterday >= 2){
        // Tier 3: Standard Clear (50% - 99% completed, e.g. 3 of 4)
        s.streak = (s.streak || 0) + 1;
        s.best = Math.max(s.best || 0, s.streak);
        result = { streak: s.streak, tier: 'cleared', bonusStatPoints: 0, streakPreserved: true };
        if(typeof log === 'function') log('DAILY CLEAR', `Standard Clear. Streak advanced to <b>${s.streak} Days</b>!`);
      } else if(pct > 0 || completedYesterday >= 1){
        // Tier 2: Partial Progress Protected (1% - 49% completed)
        // Streak is FROZEN / PROTECTED — NEVER RESET TO ZERO!
        result = { streak: s.streak, tier: 'protected', bonusStatPoints: 0, streakPreserved: true };
        if(typeof log === 'function') log('STREAK PROTECTED', `Partial momentum preserved your <b>${s.streak}-day streak</b>!`);
      } else {
        // Tier 1: 0% Completed — Streak at risk
        if(s.freezes > 0){
          s.freezes--;
          if(!s.freezeUsed) s.freezeUsed = [];
          s.freezeUsed.push(s.lastDay);
          result = { streak: s.streak, tier: 'risk', bonusStatPoints: 0, streakPreserved: true };
          if(typeof log === 'function') log('STREAK SHIELD', `Streak Freeze automatically preserved your <b>${s.streak}-day streak</b>!`);
        } else {
          // Trigger Red Penalty Quest opportunity instead of instant hard reset
          s.penaltyQuestActive = true;
          s.penaltyQuestExpires = Date.now() + (24 * 60 * 60 * 1000);
          result = { streak: s.streak, tier: 'risk', bonusStatPoints: 0, streakPreserved: false };
          if(typeof log === 'function') log('PENALTY QUEST ACTIVE', `[ ! WARNING ] Streak endangered! Clear your emergency Penalty Quest within 24h to recover your <b>${s.streak}-day streak</b>!`, true);
        }
      }

      // 2. Archive yesterday's daily entries to history snapshot
      if(!s.hist) s.hist = [];
      s.hist.unshift({
        date: s.lastDay,
        completedCount: completedYesterday,
        totalTasks: totalAvailable,
        pct: Math.round(pct * 100),
        streak: s.streak,
        timestamp: Date.now()
      });
      if(s.hist.length > 90) s.hist.pop();

      // 3. Reset daily task completion flags for the new day
      s.daily = {};
      s.questRerollsRemaining = 1; // 1 free reroll every day
      s.lastDay = today;
      console.log(`[DailyRollover] Rollover completed. Active streak: ${s.streak} days. Free reroll granted.`);
    }
    return result;
  }

  return {
    normalizeTask: normalizeTask,
    findTaskDefinition: findTaskDefinition,
    toggleTask: toggleTask,
    rerollTask: rerollTask,
    processDailyRollover: processDailyRollover
  };
})();

// Route global toggleLifeOSTask to TaskEngine.toggleTask
window.toggleLifeOSTask = function(taskId, ev){
  return TaskEngine.toggleTask(taskId, ev);
};


if(typeof window !== 'undefined'){
  window.TaskEngine = TaskEngine;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = TaskEngine;
}
