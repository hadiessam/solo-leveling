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

      // Special Bassem School check if completed via task list
      if(taskId === 'q_bassem_daily' && typeof logBassemStudySession === 'function'){
        if(S.bassem && S.bassem.todayMinutes < 60){
          logBassemStudySession(60);
        }
      }

      if(typeof SystemEvents !== 'undefined'){
        SystemEvents.emit('TASK_COMPLETED', { taskId, title: task.title, xp: finalXP });
      }
      if(typeof log === 'function') log('TASK COMPLETE', `<b>${esc(task.title)}</b> cleared. <b>+${finalXP} XP</b>.`);
      if(ev && typeof floatXP === 'function') floatXP(ev.clientX, ev.clientY, finalXP, false);
    }

    if(typeof save === 'function') save();
    if(typeof renderDashboard === 'function') renderDashboard();
    else if(typeof renderAll === 'function') renderAll();

    return true;
  }

  /* Centralized Daily Rollover Engine */
  function processDailyRollover(){
    if(!S) return;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    if(!S.lastDay) S.lastDay = today;

    // Check if day has turned in Cairo timezone
    if(S.lastDay !== today){
      console.log(`[DailyRollover] Advancing day from ${S.lastDay} to ${today}...`);

      // 1. Calculate tasks completed on the previous day
      const completedYesterday = Object.keys(S.daily || {}).length;
      if(completedYesterday >= 3){
        S.streak = (S.streak || 0) + 1;
        S.best = Math.max(S.best || 0, S.streak);
      } else if(S.streak > 0 && S.lastActive !== S.lastDay){
        // Check if freeze can protect streak
        if(S.freezes > 0){
          S.freezes--;
          if(!S.freezeUsed) S.freezeUsed = [];
          S.freezeUsed.push(S.lastDay);
          if(typeof log === 'function') log('STREAK FROZEN', `Streak Freeze automatically preserved your ${S.streak}-day streak!`);
        } else {
          S.streak = 1; // Graceful reset to 1
        }
      }

      // 2. Archive yesterday's daily entries to history snapshot
      if(!S.hist) S.hist = [];
      S.hist.unshift({
        date: S.lastDay,
        completedCount: completedYesterday,
        streak: S.streak,
        xp: S.xp
      });
      if(S.hist.length > 90) S.hist = S.hist.slice(0, 90);

      // 3. Clear daily task completions for the new day
      S.daily = {};
      if(S.taskXP) S.taskXP = {};
      S.focusSessions = 0;
      S.focusDate = today;

      // 4. Update Foundation profile day index if active
      if(S.foundationProfile && S.foundationProfile.foundationActive){
        S.foundationProfile.dayIndex = Math.min(14, (S.foundationProfile.dayIndex || 1) + 1);
      }

      S.lastDay = today;

      // 5. Create automatic morning recovery snapshot
      if(typeof StorageManager !== 'undefined' && StorageManager.createSnapshot){
        StorageManager.createSnapshot('Daily-Rollover-' + today, S).catch(()=>{});
      }

      if(typeof SystemEvents !== 'undefined'){
        SystemEvents.emit('DAY_ROLLOVER', { date: today, streak: S.streak });
      }
      if(typeof save === 'function') save();
    }
  }

  return {
    normalizeTask: normalizeTask,
    findTaskDefinition: findTaskDefinition,
    toggleTask: toggleTask,
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
