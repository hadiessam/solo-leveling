/* =====================================================================
   SOLO LEVELING — CORE SYSTEM ENGINE
   System Versioning, State Migrations, Integrity Validation,
   Cairo Timezone SystemClock, Event Bus, and Error Isolation
   ===================================================================== */

const SYSTEM_VERSION = 50;

/* ---------------------------------------------------------------------
   1. SYSTEM CLOCK (Africa/Cairo Timezone Authority)
   --------------------------------------------------------------------- */
const SystemClock = (function(){
  const TIMEZONE = 'Africa/Cairo';

  /* Get current Date object adjusted to Cairo time */
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
    const cairoDate = getCairoDate(d);
    const hr = cairoDate.getHours();
    const min = cairoDate.getMinutes();
    return (hr === 23 && min >= 45) || (hr === 0 && min <= 30);
  }

  /* Get YYYY-MM-DD date key */
  function dayKey(d){
    const dateObj = d ? new Date(d) : new Date();
    try{
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(dateObj);
      const y = parts.find(p => p.type === 'year').value;
      const m = parts.find(p => p.type === 'month').value;
      const day = parts.find(p => p.type === 'day').value;
      return `${y}-${m}-${day}`;
    }catch(e){
      return dateObj.toISOString().slice(0, 10);
    }
  }

  /* Get ISO week key (e.g. 2026-W45) */
  function weekKey(d){
    const dateObj = d ? new Date(d) : new Date();
    const target = new Date(dateObj.valueOf());
    const dayNr = (dateObj.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setUTCMonth(0, 1);
    if(target.getUTCDay() !== 4){
      target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
    }
    const weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);
    const year = dateObj.getUTCFullYear();
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  /* Get YYYY-MM month key */
  function monthKey(d){
    return dayKey(d).slice(0, 7);
  }

  /* Return integer day difference between two YYYY-MM-DD keys */
  function daysBetween(k1, k2){
    if(!k1 || !k2) return 0;
    const t1 = new Date(k1).getTime();
    const t2 = new Date(k2).getTime();
    return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
  }

  return {
    timezone: TIMEZONE,
    dayKey: dayKey,
    weekKey: weekKey,
    monthKey: monthKey,
    daysBetween: daysBetween,
    nowCairo: getCairoDate,
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

  return {
    on: on,
    off: off,
    emit: emit
  };
})();

/* ---------------------------------------------------------------------
   3. STATE VALIDATION & REPAIR ENGINE
   --------------------------------------------------------------------- */
function validateState(state){
  const issues = [];
  if(!state) return { valid: false, issues: ['State object is null or undefined'] };

  // 1. XP and Level Integrity Check
  if(typeof state.xp !== 'number' || isNaN(state.xp) || state.xp < 0){
    issues.push(`Invalid XP value: ${state.xp}`);
  }
  const expectedLevel = Math.max(1, Math.floor((state.xp || 0) / 400) + 1);
  if(state.level !== expectedLevel){
    issues.push(`Level mismatch: state.level is ${state.level}, expected ${expectedLevel} for ${state.xp} XP`);
  }

  // 2. Vitals Range
  if(typeof state.hp === 'number' && (state.hp < 0 || state.hp > 200)){
    issues.push(`Abnormal HP value: ${state.hp}`);
  }
  if(typeof state.mana === 'number' && (state.mana < 0 || state.mana > 200)){
    issues.push(`Abnormal Mana value: ${state.mana}`);
  }

  // 3. Essential Collection Types
  const collectionKeys = ['daily', 'weekly', 'boss', 'courses', 'habits', 'expenses', 'statXP', 'skillTree'];
  collectionKeys.forEach(k => {
    if(state[k] && typeof state[k] !== 'object'){
      issues.push(`Field ${k} should be an object, found ${typeof state[k]}`);
    }
  });

  const arrayKeys = ['rewards', 'milestones', 'badges', 'warnings', 'reviews', 'hist', 'customTasks'];
  arrayKeys.forEach(k => {
    if(state[k] && !Array.isArray(state[k])){
      issues.push(`Field ${k} should be an array, found ${typeof state[k]}`);
    }
  });

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/* Safe State Repair — Auto-snapshots before touching anything */
function repairState(state){
  if(!state) return null;
  // Create emergency snapshot before repair
  if(typeof StorageManager !== 'undefined' && StorageManager.createSnapshot){
    StorageManager.createSnapshot('Pre-Repair Snapshot', state).catch(()=>{});
  }

  // 1. Ensure all standard keys from blank() exist
  const template = (typeof blank === 'function') ? blank() : {};
  for(const k in template){
    if(typeof state[k] === 'undefined'){
      state[k] = JSON.parse(JSON.stringify(template[k]));
    }
  }

  // 2. Fix Level if out of sync with authentic XP
  if(typeof state.xp === 'number' && !isNaN(state.xp)){
    state.level = Math.max(1, Math.floor(state.xp / 400) + 1);
  }

  // 3. Fix negative values
  if(state.hp < 0) state.hp = 100;
  if(state.mana < 0) state.mana = 50;
  if(state.streak < 0) state.streak = 0;

  // 4. Ensure vital structures are valid objects/arrays
  if(!state.daily || typeof state.daily !== 'object') state.daily = {};
  if(!state.weekly || typeof state.weekly !== 'object') state.weekly = {};
  if(!state.boss || typeof state.boss !== 'object') state.boss = {};
  if(!state.courses || typeof state.courses !== 'object') state.courses = {};
  if(!state.expenses || typeof state.expenses !== 'object') state.expenses = {};
  if(!state.habits || typeof state.habits !== 'object') state.habits = {};
  if(!state.customTasks || !Array.isArray(state.customTasks)) state.customTasks = [];
  if(!state.xpLedger || !Array.isArray(state.xpLedger)) state.xpLedger = [];

  // 5. Ensure Life OS subsystems exist
  if(!state.lifeStatus){
    state.lifeStatus = {
      location: 'Cairo, Egypt',
      destination: 'Saudi Arabia (Riyadh / Jeddah)',
      travelStatus: 'imminent',
      targetTravelDate: 'Late November 2026',
      expensesPaid: true,
      flightBooked: false,
      saudiPhone: false,
      currentDifficulty: 1,
      difficultyName: 'Level 1 — Normal',
      activeBossFocus: 'b2'
    };
  }
  if(!state.foundationProfile){
    state.foundationProfile = {
      dayIndex: 1,
      foundationActive: true,
      recoveryMode: false,
      totalMandatoryMinutes: 220
    };
  }
  if(!state.healthData){
    state.healthData = {
      weightLog: [],
      workouts: [],
      sleepLog: [],
      waterLog: {},
      stepsLog: {},
      recoveryScore: 85
    };
  }
  if(!state.jobHunt){
    state.jobHunt = {
      applications: [],
      interviews: [],
      targetRoles: ['Senior Performance Marketing Specialist', 'Media Buyer', 'Paid Ads Lead'],
      targetLocations: ['Riyadh, Saudi Arabia', 'Jeddah, Saudi Arabia', 'Cairo, Egypt', 'Remote (Gulf)']
    };
  }
  if(!state.portfolio){
    state.portfolio = {
      caseStudies: [],
      cvBullets: []
    };
  }
  if(!state.network){
    state.network = {
      contacts: [],
      followUps: []
    };
  }
  if(!state.planner){
    state.planner = {
      timeBlocks: {},
      goalsHierarchy: { vision: 'Elite Gulf Performance Marketing Director & Agency Owner', yearly: [], quarterly: [], monthly: [] },
      reviews: { daily: {}, weekly: {}, monthly: {}, quarterly: {}, yearly: {} }
    };
  }
  if(!state.secondBrain){
    state.secondBrain = {
      notes: [],
      decisionLog: [],
      lessonsDatabase: []
    };
  }

  state.ver = SYSTEM_VERSION;
  state.lastModified = Date.now();
  return state;
}

/* ---------------------------------------------------------------------
   4. DETERMINISTIC STATE MIGRATION ENGINE
   --------------------------------------------------------------------- */
function migrateState(state){
  if(!state) return null;
  const currentVer = state.ver || 1;
  if(currentVer >= SYSTEM_VERSION) return state;

  console.log(`[Migration] Migrating state from v${currentVer} to v${SYSTEM_VERSION}...`);
  if(typeof StorageManager !== 'undefined' && StorageManager.createSnapshot){
    StorageManager.createSnapshot(`Pre-Migration-v${currentVer}-to-v${SYSTEM_VERSION}`, state).catch(()=>{});
  }

  // Safe migration steps
  const repaired = repairState(state);
  repaired.ver = SYSTEM_VERSION;
  return repaired;
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
            <div style="font-size:12.5px;color:#fff;">${esc(componentName)} experienced a rendering glitch, but your progress and state remain 100% safe.</div>
            <div style="font-size:11px;color:var(--muted);margin-top:6px;">Error: ${esc(err.message)}</div>
          </div>
        `;
      }
    }
  }
}


if(typeof window !== 'undefined'){
  window.SYSTEM_VERSION = SYSTEM_VERSION;
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
    SystemEvents,
    SystemClock,
    safeRender,
    validateState,
    repairState,
    migrateState
  };
}
