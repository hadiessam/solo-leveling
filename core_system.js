/* =====================================================================
   SOLO LEVELING — CORE SYSTEM ENGINE (v52 UNIFIED)
   System Versioning, Safe Versioned Migrations (v1 -> v6),
   Cairo Timezone SystemClock Authority, Event Bus, and Error Isolation.
   ===================================================================== */

const SYSTEM_VERSION = 52;
const CURRENT_STATE_VERSION = 6;

/* ---------------------------------------------------------------------
   1. SYSTEM CLOCK (Africa/Cairo Timezone Authority)
   --------------------------------------------------------------------- */
const SystemClock = (function(){
  const TIMEZONE = 'Africa/Cairo';

  /* Get Date-like breakdown in Africa/Cairo timezone */
  function getCairoParts(d){
    const dateObj = d ? (d instanceof Date ? d : new Date(d)) : new Date();
    try{
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
        weekday: 'short'
      }).formatToParts(dateObj);
      const map = {};
      parts.forEach(p => { map[p.type] = p.value; });
      return map;
    }catch(e){
      return {
        year: String(dateObj.getFullYear()),
        month: String(dateObj.getMonth() + 1).padStart(2, '0'),
        day: String(dateObj.getDate()).padStart(2, '0'),
        hour: String(dateObj.getHours()).padStart(2, '0'),
        minute: String(dateObj.getMinutes()).padStart(2, '0'),
        second: String(dateObj.getSeconds()).padStart(2, '0'),
        weekday: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateObj.getDay()]
      };
    }
  }

  /* Get current Date object shifted to Cairo wall-clock time */
  function getCairoDate(d){
    const baseDate = d ? new Date(d) : new Date();
    try {
      const s = baseDate.toLocaleString('en-US', { timeZone: TIMEZONE });
      return new Date(s);
    } catch(e) {
      return baseDate;
    }
  }

  function isCairoMidnightWindow(d){
    const p = getCairoParts(d);
    const hr = parseInt(p.hour, 10) || 0;
    const min = parseInt(p.minute, 10) || 0;
    return (hr === 23 && min >= 45) || (hr === 0 && min <= 30);
  }

  /* Get YYYY-MM-DD date key strictly in Africa/Cairo timezone */
  function dayKey(d){
    const p = getCairoParts(d);
    return `${p.year}-${p.month}-${p.day}`;
  }

  /* Add N calendar days to a YYYY-MM-DD key safely in UTC calendar arithmetic */
  function shiftDayKey(k, deltaDays){
    if(!k || typeof k !== 'string') return dayKey();
    const [y, m, d] = k.split('-').map(n => parseInt(n, 10));
    const dt = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + deltaDays));
    return dt.toISOString().slice(0, 10);
  }

  /* Milliseconds remaining until next 00:00:05 Africa/Cairo midnight */
  function msUntilCairoMidnight(d){
    const p = getCairoParts(d);
    const hr = parseInt(p.hour, 10) || 0;
    const min = parseInt(p.minute, 10) || 0;
    const sec = parseInt(p.second, 10) || 0;
    const secondsElapsedToday = (hr * 3600) + (min * 60) + sec;
    const secondsRemaining = (24 * 3600) - secondsElapsedToday + 5; // +5s buffer past midnight
    return Math.max(2000, secondsRemaining * 1000);
  }

  /* Get Egypt Week key (Friday start) */
  function weekKey(d){
    const k = dayKey(d);
    const [y, m, day] = k.split('-').map(n => parseInt(n, 10));
    const dt = new Date(Date.UTC(y, m - 1, day));
    const dow = dt.getUTCDay(); // 0=Sun..5=Fri..6=Sat
    const off = (dow + 2) % 7; // Fri=0, Sat=1...
    return shiftDayKey(k, -off);
  }

  /* Get YYYY-MM month key in Africa/Cairo */
  function monthKey(d){
    return dayKey(d).slice(0, 7);
  }

  /* Return integer day difference between two YYYY-MM-DD keys */
  function daysBetween(k1, k2){
    if(!k1 || !k2) return 0;
    const [y1, m1, d1] = k1.split('-').map(Number);
    const [y2, m2, d2] = k2.split('-').map(Number);
    const t1 = Date.UTC(y1, m1 - 1, d1);
    const t2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round((t2 - t1) / 86400000);
  }

  return {
    timezone: TIMEZONE,
    dayKey: dayKey,
    shiftDayKey: shiftDayKey,
    weekKey: weekKey,
    monthKey: monthKey,
    daysBetween: daysBetween,
    nowCairo: getCairoDate,
    getCairoParts: getCairoParts,
    msUntilCairoMidnight: msUntilCairoMidnight,
    isCairoMidnightWindow: isCairoMidnightWindow
  };
})();

/* ---------------------------------------------------------------------
   2. SYSTEM EVENT BUS (Decoupled Domain Communication)
   --------------------------------------------------------------------- */
const SystemEvents = (function(){
  const listeners = {};

  function on(event, callback){
    if(!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    return () => off(event, callback);
  }

  function off(event, callback){
    if(!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  }

  function emit(event, data){
    if(!listeners[event]) return;
    listeners[event].forEach(cb => {
      try{
        cb(data);
      }catch(err){
        console.error(`[SystemEvents] Error in listener for ${event}:`, err);
      }
    });
  }

  return { on, off, emit };
})();

/* ---------------------------------------------------------------------
   3. STATE VALIDATION & REPAIR ENGINE
   --------------------------------------------------------------------- */
function validateState(state){
  const issues = [];
  if(!state) return { valid: false, issues: ['State object is null or undefined'] };

  if(typeof state.xp !== 'number' || isNaN(state.xp) || state.xp < 0){
    issues.push(`Invalid XP value: ${state.xp}`);
  }
  const expectedLevel = Math.max(1, Math.floor((state.xp || 0) / 400) + 1);
  if(state.level !== expectedLevel){
    issues.push(`Level mismatch: state.level is ${state.level}, expected ${expectedLevel} for ${state.xp} XP`);
  }

  const objKeys = ['daily', 'dailyHistory', 'habitsToday', 'habitHistory', 'weekly', 'boss', 'courses', 'expenses', 'statXP', 'skillTree', 'penaltyLog', 'learnedVocabulary', 'masteredVocabulary', 'vocabularyHistory'];
  objKeys.forEach(k => {
    if(state[k] && (typeof state[k] !== 'object' || Array.isArray(state[k]))){
      issues.push(`Field ${k} should be a plain object`);
    }
  });

  const arrKeys = ['rewards', 'milestones', 'badges', 'warnings', 'reviews', 'hist', 'customTasks', 'xpLedger', 'seenVocabulary'];
  arrKeys.forEach(k => {
    if(state[k] && !Array.isArray(state[k])){
      issues.push(`Field ${k} should be an array`);
    }
  });

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

function repairState(state){
  if(!state) return null;

  const template = (typeof blank === 'function') ? blank() : {};
  for(const k in template){
    if(typeof state[k] === 'undefined'){
      state[k] = JSON.parse(JSON.stringify(template[k]));
    }
  }

  if(typeof state.xp !== 'number' || isNaN(state.xp) || state.xp < 0) state.xp = 0;
  state.level = Math.max(1, Math.floor(state.xp / 400) + 1);
  if(typeof state.streak !== 'number' || isNaN(state.streak) || state.streak < 0) state.streak = 0;
  if(typeof state.best !== 'number' || isNaN(state.best) || state.best < state.streak) state.best = state.streak;

  const ensureObj = k => { if(!state[k] || typeof state[k] !== 'object' || Array.isArray(state[k])) state[k] = {}; };
  const ensureArr = k => { if(!Array.isArray(state[k])) state[k] = []; };

  ['daily', 'dailyHistory', 'habitsToday', 'habitHistory', 'weekly', 'boss', 'courses', 'expenses', 'statXP', 'skillTree', 'taskXP', 'penaltyLog', 'learnedVocabulary', 'masteredVocabulary', 'vocabularyHistory', 'xpSource', 'projects', 'journal'].forEach(ensureObj);
  ['customTasks', 'xpLedger', 'seenVocabulary', 'badges', 'warnings', 'reviews', 'hist', 'rewards', 'milestones', 'perfectDays'].forEach(ensureArr);

  // Clean up corrupted object values inside S.taskXP (legacy v51 bug stored XpEngine object instead of number)
  for(const tid in state.taskXP){
    const val = state.taskXP[tid];
    if(typeof val === 'object' && val !== null){
      state.taskXP[tid] = Number(val.finalXP || val.amount || 0);
    } else if(typeof val !== 'number' || isNaN(val)){
      delete state.taskXP[tid];
    }
  }

  if(!state.dailyMissions || typeof state.dailyMissions !== 'object') state.dailyMissions = { date: '', ids: [] };
  if(!state.dailyVocabulary || typeof state.dailyVocabulary !== 'object') state.dailyVocabulary = { date: '', words: [] };
  if(!state.relocationFund) state.relocationFund = { target: 120000, current: 0, currency: 'EGP' };
  if(!state.healthData) state.healthData = { weightLog: [], workouts: [], sleepLog: [], waterLog: {}, stepsLog: {} };
  if(!state.planner) state.planner = { timeBlocks: {}, goalsHierarchy: { vision: '', yearly: [], quarterly: [], monthly: [] }, reviews: {} };
  if(!state.lifeStatus) state.lifeStatus = { location: 'Cairo, Egypt', destination: 'Saudi Arabia', targetTravelDate: 'Late November 2026', expensesPaid: true, flightBooked: false, saudiPhone: false, currentDifficulty: 1, difficultyName: 'Level 1 — Normal' };

  state.ver = SYSTEM_VERSION;
  state.lastModified = Date.now();
  return state;
}

/* ---------------------------------------------------------------------
   4. SAFE VERSIONED MIGRATION ENGINE (v1..v5 -> v6)
   Zero Data Loss. Creates backup before mutating.
   --------------------------------------------------------------------- */
function migrateV1ToV5(state){
  if(!state.xpSource) state.xpSource = {};
  if(!state.statXP) state.statXP = {};
  if(!state.habitDays) state.habitDays = {};
  if(!state.habits) state.habits = {};
  if(!state.log30) state.log30 = {};
  state.stateVersion = 5;
  return state;
}

function migrateV5ToV6(state){
  const today = SystemClock.dayKey();

  // 1. Migrate S.log30 & S.perfectDays -> S.dailyHistory
  if(!state.dailyHistory || typeof state.dailyHistory !== 'object') state.dailyHistory = {};
  if(state.log30 && typeof state.log30 === 'object'){
    for(const dt in state.log30){
      const rec = state.log30[dt];
      if(!rec) continue;
      const existing = state.dailyHistory[dt];
      const done = Number(rec.done || 0);
      const tot = Number(rec.total || Math.max(done, 1));
      if(!existing){
        state.dailyHistory[dt] = {
          date: dt,
          missionsCompleted: done,
          missionsTotal: tot,
          completedIds: [],
          missionIds: [],
          xpEarned: Number(rec.xpEarned || 0),
          activeDay: done > 0
        };
      }
    }
  }
  if(Array.isArray(state.perfectDays)){
    state.perfectDays.forEach(dt => {
      if(!state.dailyHistory[dt]){
        state.dailyHistory[dt] = {
          date: dt,
          missionsCompleted: 1,
          missionsTotal: 1,
          completedIds: [],
          missionIds: [],
          xpEarned: 0,
          activeDay: true
        };
      } else {
        state.dailyHistory[dt].activeDay = true;
      }
    });
  }

  // 2. Migrate S.habitDays & S.habits -> S.habitHistory & S.habitsToday
  if(!state.habitHistory || typeof state.habitHistory !== 'object') state.habitHistory = {};
  if(!state.habitsToday || typeof state.habitsToday !== 'object') state.habitsToday = {};

  // Migrate legacy d1..d27 habitDays
  if(state.habitDays && typeof state.habitDays === 'object'){
    for(const hid in state.habitDays){
      const arr = state.habitDays[hid];
      if(!Array.isArray(arr)) continue;
      arr.forEach(dt => {
        if(!dt) return;
        if(!state.habitHistory[dt]) state.habitHistory[dt] = {};
        if(!state.habitHistory[dt][hid]){
          state.habitHistory[dt][hid] = { habitId: hid, date: dt, completed: true, xpEarned: 10 };
        }
        if(dt === today){
          state.habitsToday[hid] = true;
        }
      });
    }
  }

  // Migrate legacy HABIT_TRACKER S.habits[h1..h10].days
  if(state.habits && typeof state.habits === 'object'){
    for(const hid in state.habits){
      const st = state.habits[hid];
      if(st && Array.isArray(st.days)){
        st.days.forEach(dt => {
          if(!dt) return;
          if(!state.habitHistory[dt]) state.habitHistory[dt] = {};
          if(!state.habitHistory[dt][hid]){
            state.habitHistory[dt][hid] = { habitId: hid, date: dt, completed: true, xpEarned: 10 };
          }
          if(dt === today){
            state.habitsToday[hid] = true;
          }
        });
      }
    }
  }

  // Remove any legacy habit IDs that polluted S.daily so S.daily ONLY reflects Daily Missions
  const legacyHabitIds = ['d1','d2','d3','d4','d8','d9','d10','d11','d14','d22'];
  if(state.daily && typeof state.daily === 'object'){
    legacyHabitIds.forEach(hid => {
      if(state.daily[hid]){
        const dt = typeof state.daily[hid] === 'string' ? state.daily[hid] : (state.lastDay || today);
        if(!state.habitHistory[dt]) state.habitHistory[dt] = {};
        if(!state.habitHistory[dt][hid]){
          state.habitHistory[dt][hid] = { habitId: hid, date: dt, completed: true, xpEarned: 10 };
        }
        if(dt === today) state.habitsToday[hid] = true;
        delete state.daily[hid];
      }
    });
  }

  // 3. Migrate vocabulary S.vocab & S.vocabStatus -> masteredVocabulary / learnedVocabulary / seenVocabulary
  if(!state.masteredVocabulary) state.masteredVocabulary = {};
  if(!state.learnedVocabulary) state.learnedVocabulary = {};
  if(!state.seenVocabulary) state.seenVocabulary = [];
  if(!state.vocabularyHistory) state.vocabularyHistory = {};

  if(state.vocab && typeof state.vocab === 'object'){
    for(const vk in state.vocab){
      const dt = typeof state.vocab[vk] === 'string' ? state.vocab[vk] : today;
      state.masteredVocabulary[vk] = dt;
      if(!state.seenVocabulary.includes(vk)) state.seenVocabulary.push(vk);
    }
  }
  if(state.vocabStatus && typeof state.vocabStatus === 'object'){
    for(const vk in state.vocabStatus){
      const st = state.vocabStatus[vk];
      if(st === 'mastered'){
        state.masteredVocabulary[vk] = state.masteredVocabulary[vk] || today;
      } else if(st === 'learning'){
        state.learnedVocabulary[vk] = state.learnedVocabulary[vk] || today;
      }
      if(!state.seenVocabulary.includes(vk)) state.seenVocabulary.push(vk);
    }
  }

  // 4. Sync lastProcessedDate safely WITHOUT destructively punishing legacy gap!
  // Archive old lastDay if it has daily missions before moving lastProcessedDate to today
  const prevDay = state.lastProcessedDate || state.lastDay;
  if(prevDay && prevDay !== today){
    if(state.daily && Object.keys(state.daily).length > 0){
      const prevDoneIds = Object.keys(state.daily);
      if(!state.dailyHistory[prevDay]){
        state.dailyHistory[prevDay] = {
          date: prevDay,
          missionsCompleted: prevDoneIds.length,
          missionsTotal: Math.max(prevDoneIds.length, 6),
          completedIds: prevDoneIds,
          missionIds: prevDoneIds,
          xpEarned: 0,
          activeDay: true
        };
      }
      state.daily = {};
    }
    // Preserve authentic progress baseline without multi-day retroactive penalty wipe
    state.lastProcessedDate = today;
    state.lastDay = today;
  }
  if(!state.lastProcessedDate){
    state.lastProcessedDate = today;
    state.lastDay = today;
  }

  state.stateVersion = 6;
  return state;
}

function migrateState(state){
  if(!state) return null;
  const ver = state.stateVersion || (state.ver >= 52 ? 6 : 1);
  if(ver >= CURRENT_STATE_VERSION && state.ver >= SYSTEM_VERSION){
    return repairState(state);
  }

  // Save pre-migration snapshot safely
  let rawCopy = null;
  try{
    rawCopy = JSON.stringify(state);
    if(typeof localStorage !== 'undefined' && !localStorage.getItem('sl_backup_pre_v6')){
      localStorage.setItem('sl_backup_pre_v6', rawCopy);
    }
  }catch(e){}

  if(typeof StorageManager !== 'undefined' && StorageManager.createSnapshot){
    StorageManager.createSnapshot(`Pre-Migration-v${ver}-to-v${CURRENT_STATE_VERSION}`, state).catch(()=>{});
  }

  try{
    let s = JSON.parse(rawCopy || JSON.stringify(state));
    if((s.stateVersion || 1) < 5) s = migrateV1ToV5(s);
    if((s.stateVersion || 5) < 6) s = migrateV5ToV6(s);
    s = repairState(s);
    s.stateVersion = CURRENT_STATE_VERSION;
    s.ver = SYSTEM_VERSION;
    console.log(`[Migration] State safely migrated to stateVersion ${CURRENT_STATE_VERSION} (v${SYSTEM_VERSION}). XP=${s.xp}, Streak=${s.streak}`);
    return s;
  }catch(err){
    console.error('[Migration] Migration failed, rolling back cleanly:', err);
    return rawCopy ? JSON.parse(rawCopy) : state;
  }
}

/* ---------------------------------------------------------------------
   5. ERROR ISOLATION (Safe Render Wrapper)
   --------------------------------------------------------------------- */
function safeRender(componentName, renderFn, fallbackSelector){
  try{
    renderFn();
  }catch(err){
    console.error(`[ErrorIsolation] Component '${componentName}' failed to render:`, err);
    if(fallbackSelector){
      const el = typeof $ === 'function' ? $(fallbackSelector) : document.querySelector(fallbackSelector);
      if(el){
        el.innerHTML = `
          <div class="system-error-card" style="padding:14px;border:1px solid rgba(239,68,68,0.4);background:rgba(239,68,68,0.08);border-radius:6px;margin:10px 0;">
            <div style="font-family:var(--hud);font-size:12px;color:var(--red);letter-spacing:1px;margin-bottom:4px;">⚠️ SYSTEM SUBSYSTEM RECOVERED</div>
            <div style="font-size:12.5px;color:#fff;">${typeof esc === 'function' ? esc(componentName) : componentName} experienced a rendering glitch, but your progress remains 100% safe.</div>
          </div>`;
      }
    }
  }
}

if(typeof window !== 'undefined'){
  window.SYSTEM_VERSION = SYSTEM_VERSION;
  window.CURRENT_STATE_VERSION = CURRENT_STATE_VERSION;
  window.SystemEvents = SystemEvents;
  window.SystemClock = SystemClock;
  window.safeRender = safeRender;
  window.validateState = validateState;
  window.repairState = repairState;
  window.migrateState = migrateState;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = {
    SYSTEM_VERSION,
    CURRENT_STATE_VERSION,
    SystemEvents,
    SystemClock,
    safeRender,
    validateState,
    repairState,
    migrateState
  };
}
