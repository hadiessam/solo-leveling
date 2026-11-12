/* =====================================================================
   SOLO LEVELING — CORE ENGINE
   State, XP, penalties, streak freeze, courses, storage.
   ===================================================================== */

const LEVEL_XP    = 400;   /* was 250 — levels should take real work */
const STAT_XP     = 150;   /* was 120 */
const TIER_LEVELS = {1:1, 2:5, 3:15};
const STAGE_LEVELS= {1:1, 2:10, 3:30};

/* PRODUCTION MODE:
   Uses official 'soloV6' key & live JSONBin sync.
   Guarantees all 27+ days of authentic progress are preserved across devices. */
const IS_DEV_MODE = false;
const SAVE_KEY    = 'soloV6';

/* CLOUD SYNC — JSONBin.io (syncs progress across devices) */
/* OPTIONAL CLOUD SYNC (Optional zero-dependency sync)
   Local-first architecture: Zero hardcoded secret keys in code repository.
   If user enables optional remote backup, credentials are read safely from localStorage. */
function getCloudSyncConfig(){
  try {
    const id = localStorage.getItem('solo_cloud_bin_id') || '';
    const key = localStorage.getItem('solo_cloud_key') || '';
    return { id, key, enabled: !!(id && key), url: id ? ('https://api.jsonbin.io/v3/b/' + id) : '' };
  } catch(e) {
    return { id: '', key: '', enabled: false, url: '' };
  }
}

/* streak multiplier: consistency pays, but it is capped */
const MULT_MAX    = 1.5;   /* +50% XP at a 100-day streak */
const MULT_SPAN   = 200;   /* days needed to reach the cap */

/* perfect-day bonus: clear every mission and get paid for it */
const PERFECT_BONUS = 75;

/* milestone levels that get a bigger celebration */
const MILESTONES  = {5:'TIER 2 UNLOCKED', 10:'COURSE STAGE 2', 15:'TIER 3 UNLOCKED',
                     20:'DOUBLE CENTURY', 25:'CHAPTER 4', 30:'COURSE STAGE 3',
                     40:'CHAPTER 5', 50:'HALF CENTURY', 55:'CHAPTER 6',
                     70:'CHAPTER 7', 85:'CHAPTER 8', 100:'CENTURION'};

/* ---------------------------------------------------------------------
   STATE
   --------------------------------------------------------------------- */
function blank(){
  return {
    ver: 52,
    stateVersion: 6,
    xp: 0, level: 1, streak: 0, best: 0,
    lastActive: '', lastDay: '', lastProcessedDate: '', lastStreakDate: '', lastWeek: '',
    daily: {},
    dailyMissions: { date: '', ids: [] },
    dailyHistory: {},
    habitsToday: {},
    habitHistory: {},
    customHabits: [],
    dailyVocabulary: { date: '', words: [] },
    seenVocabulary: [],
    learnedVocabulary: {},
    masteredVocabulary: {},
    vocabularyHistory: {},
    weekly: {}, boss: {}, weeklyBoss: {},
    statXP: {}, rewards: [], msgs: [], courses: {},
    qDone: 0, sDone: 0,
    penCount: 0, xpLost: 0, penaltyDay: '', penaltyLog: {},
    freezes: 0, freezeUsed: [], punishment: 0,
    started: false, startedOn: '',
    milestones: [], badges: [],
    lastBackup: '', lastAuto: '', perfectDays: [], perfectPending: '', perfectBonusScheduled: '',
    missionXP: {}, taskXP: {}, warnings: [],
    reviews: [], lastReview: '', log30: {},
    typing: { now: 0, target: 60, hist: [] },
    books: {},
    shadowLevel: 0, shadowXp: 0,
    focusSessions: 0, focusDate: '',
    vision: [], shadowChars: [],
    xpSource: {}, xpLedger: [],
    vocab: {}, vocabStatus: {}, vocabTotal: 0, vocabDays: 0,
    eggs: {}, eggsTotal: 0, eggDay: '', eggMissionsToday: 0, eggMissionTotal: 0,
    eggStreakMark: 0, eggLevelMark: 0,
    pomoRunning: false, pomoEndsAt: 0, pomoMode: 'work',
    hist: [],
    prestige: 0, prestigeMult: 1, prestigeBadges: [],
    paused: false, pauseDate: '', pauseReason: '',
    str: 0, int: 0, agi: 0, end: 0, statPoints: 0,
    monthlyBoss: { active: false, progress: 0, target: 0, reward: 0, month: '' },
    equipment: { weapon: null, armor: null, accessory: null },
    coachMsg: '', coachDate: '',
    habitStrength: {}, negativeHabits: {}, negHabitDamage: 0,
    skillTree: {}, customPhrase: '',
    habitDays: {}, formedHabits: {},
    moneyProgress: {}, speaking: { wordsDone: [], recordings: [] },
    habits: {}, uptodate: { readNews: [] }, expenses: {},
    podcastCat: 'all', podcastsListened: [],
    projects: {}, customTasks: [], taskStatus: {}, habitNotifications: [],
    knowledgeNotes: [], journal: {},
    relocationFund: { target: 120000, current: 0, currency: 'EGP' },
    activeRoadmap: 'saudi',
    questRerollsRemaining: 1
  };
}

var S = read();
if(typeof window !== 'undefined') window.S = S;
if(!S.lifeStatus){
  S.lifeStatus = {
    location: 'Cairo, Egypt',
    destination: 'Saudi Arabia (Riyadh / Jeddah)',
    travelStatus: 'imminent',
    targetTravelDate: 'Late November 2026',
    expensesPaid: true,
    flightBooked: false,
    flightDetails: '',
    documentsReady: true,
    saudiPhone: false,
    saudiPhoneNumber: '',
    currentDifficulty: 1,
    difficultyName: 'Level 1 — Normal',
    activeBossFocus: 'b2',
    checkinHistory: []
  };
}
if(!S.systemUnlocks) S.systemUnlocks = [];
if(!S.foundationProfile){
  S.foundationProfile = {
    dayIndex: 1,
    foundationActive: true,
    recoveryMode: false,
    totalMandatoryMinutes: 220,
    englishAssessed: false,
    englishEstimatedLevel: 'B1/B2',
    completedFoundationDays: 0,
    weeklyReviewsCount: 0
  };
}

function finalizeLoadedState(rawState){
  if(!rawState || typeof rawState !== 'object') return blank();
  let src = Object.assign({}, rawState);
  if(typeof migrateState === 'function'){
    src = migrateState(src);
  }
  const o = Object.assign(blank(), src || {});
  o.level = Math.max(1, Math.floor((o.xp || 0) / LEVEL_XP) + 1);
  return o;
}

function read(){
  try{
    let raw = localStorage.getItem(SAVE_KEY);
    if(raw){
      try{
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed.xp === 'number'){
          return finalizeLoadedState(parsed);
        }
      }catch(e){}
    }

    if(typeof DEV_SEED_STATE !== 'undefined' && DEV_SEED_STATE && (DEV_SEED_STATE.xp >= 1000 || DEV_SEED_STATE.streak >= 20)){
      const seeded = finalizeLoadedState(DEV_SEED_STATE);
      try{ localStorage.setItem(SAVE_KEY, JSON.stringify(seeded)); }catch(e){}
      return seeded;
    }

    if(!raw) raw = localStorage.getItem('soloAutoState');
    if(raw){
      try{
        const parsed = JSON.parse(raw);
        if(parsed && typeof parsed.xp === 'number'){
          return finalizeLoadedState(parsed);
        }
      }catch(e){}
    }

    const old = localStorage.getItem('soloV5') || localStorage.getItem('soloV4') || localStorage.getItem('soloV3');
    if(old){
      try{
        const parsedOld = JSON.parse(old);
        if(parsedOld && typeof parsedOld.xp === 'number'){
          return finalizeLoadedState(parsedOld);
        }
      }catch(e){}
    }

    return blank();
  }catch(e){
    return blank();
  }
}
/* ---------------------------------------------------------------------
   SHADOW — grows automatically as you complete missions
   --------------------------------------------------------------------- */
function growShadow(){
  S.shadowXp = (S.shadowXp || 0) + 1;
  const lvl = Math.floor(S.shadowXp / 8);
  if(lvl > (S.shadowLevel || 0)){
    const was = S.shadowLevel || 0;
    S.shadowLevel = lvl;
    const oldStage = SHADOW_SOLDIER.stages.filter(s => s.level <= was).pop();
    const newStage = shadowStage();
    if(newStage.name !== (oldStage && oldStage.name)){
      setTimeout(()=>{
        ceremonyCard({
          kicker:'SHADOW EVOLVED',
          big:ic(newStage.icon,44) + '  ' + newStage.name,
          sub:newStage.desc,
          stat:'Your Shadow grows with every mission you complete.',
          rare:true
        });
        sfx('levelup');
      }, 900);
      log('SHADOW','Your Shadow evolved into <b>'+newStage.name+'</b>.');
    }
  }
}

/* Loot drops grant XP bonuses cleanly via XpEngine */
function maybeDropLoot(){
  if(Math.random() > 0.18) return null;
  const roll = Math.random() * 100;
  let cumulative = 0;
  for(const item of LOOT){
    cumulative += item.chance * 100;
    if(roll <= cumulative){
      const xpAmt = item.xp || 15;
      addXP(xpAmt, null, true, 'bonus');
      sfx(item.id === 'gem' || item.id === 'chest' ? 'gem' : 'loot');
      setTimeout(()=>{
        overlay('LOOT FOUND', ic(item.icon,50) + '  ' + item.name, '+' + xpAmt + ' XP', false);
        log('LOOT','Found <b>'+item.name+'</b> — +' + xpAmt + ' XP.');
      }, 700);
      return item;
    }
  }
  return null;
}

/* ---------------------------------------------------------------------
   SHADOW SOLDIER — your companion
   --------------------------------------------------------------------- */
function shadowStage(){
  let stage = SHADOW_SOLDIER.stages[0];
  for(const s of SHADOW_SOLDIER.stages){
    if(S.shadowLevel >= s.level) stage = s;
  }
  return stage;
}

function shadowMood(){
  const av = available(DAILY);
  const done = av.filter(m => S.daily[m.id]).length;
  const pct = av.length ? done/av.length : 0;
  if(pct >= 1) return 'happy';
  if(pct >= .5) return 'neutral';
  if(pct > 0) return 'hungry';
  return 'sad';
}

/* ---------------------------------------------------------------------
   FOCUS TIMER — Pomodoro-style, floating widget
   Runs as a real countdown that survives tab switches and page reloads.
   --------------------------------------------------------------------- */
let pomoTick = null;

function startPomodoro(){
  if(S.pomoRunning){
    /* already running — restart the current phase */
    stopPomodoro(true);
  }
  S.pomoMode = 'work';
  S.pomoEndsAt = Date.now() + FOCUS.workMin * 60 * 1000;
  S.pomoRunning = true;
  save();
  sfx('focusStart');
  showPomo();
  runPomoTick();
  log('FOCUS', 'Focus session started. ' + FOCUS.workMin + ' minutes.');
}

function stopPomodoro(silent){
  S.pomoRunning = false;
  S.pomoEndsAt = 0;
  save();
  if(pomoTick){ clearInterval(pomoTick); pomoTick = null; }
  if(!silent) sfx('close');
  hidePomo();
}

function runPomoTick(){
  if(pomoTick) clearInterval(pomoTick);
  pomoTick = setInterval(() => {
    if(!S.pomoRunning){ clearInterval(pomoTick); pomoTick = null; return; }
    const left = Math.max(0, S.pomoEndsAt - Date.now());
    paintPomo(left);
    if(left <= 0) completePomoPhase();
  }, 250);
  paintPomo(Math.max(0, S.pomoEndsAt - Date.now()));
}

function completePomoPhase(){
  if(pomoTick){ clearInterval(pomoTick); pomoTick = null; }

  if(S.pomoMode === 'work'){
    /* a finished work phase is a completed session and pays XP */
    if(S.focusDate !== dayKey()){ S.focusDate = dayKey(); S.focusSessions = 0; }
    S.focusSessions++;
    S.pomoMode = 'break';
    S.pomoEndsAt = Date.now() + FOCUS.breakMin * 60 * 1000;
    S.pomoRunning = true;
    save();
    sfx('focusEnd');
    addXP(FOCUS.xpPerSession, null, true, 'bonus');
    ceremonyCard({
      kicker:'FOCUS COMPLETE',
      big:S.focusSessions + ' / ' + FOCUS.sessionsPerDay,
      sub:'Session done. Take ' + FOCUS.breakMin + ' minutes, then go again.',
      stat:'<b>+' + FOCUS.xpPerSession + ' XP</b> earned.',
      rare:false
    });
    log('FOCUS', 'Session <b>' + S.focusSessions + '</b> complete. +' + FOCUS.xpPerSession + ' XP. Break time.');
    runPomoTick();
  } else {
    /* break over — stop and wait for the next manual start */
    S.pomoMode = 'work';
    S.pomoRunning = false;
    S.pomoEndsAt = 0;
    save();
    sfx('focusEnd');
    overlay('BREAK OVER','BACK TO WORK','Break finished. Start the next session when you are ready.', false);
    log('FOCUS','Break over. Ready for the next session.');
    hidePomo();
  }
  renderAll();
}

/* ---- the floating widget ---- */
function showPomo(){
  const el = $('pomoFloat');
  if(el) el.classList.add('show');
}
function hidePomo(){
  const el = $('pomoFloat');
  if(el) el.classList.remove('show');
}

function paintPomo(msLeft){
  const total = S.pomoMode === 'work' ? FOCUS.workMin : FOCUS.breakMin;
  const secs = Math.ceil(msLeft / 1000);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  const pct = Math.max(0, Math.min(100, (1 - msLeft / (total * 60 * 1000)) * 100));

  const t = $('pomoTime');
  if(t) t.textContent = m + ':' + s;
  const l = $('pomoLabel');
  if(l) l.textContent = S.pomoMode === 'work' ? 'FOCUS' : 'BREAK';
  const r = $('pomoRing');
  if(r) r.style.background =
    'conic-gradient(' + (S.pomoMode === 'work' ? 'var(--glow)' : 'var(--green)') +
    ' ' + pct + '%, rgba(255,255,255,.08) ' + pct + '%)';
  const w = $('pomoFloat');
  if(w) w.classList.toggle('brk', S.pomoMode === 'break');
}

/* restore a running timer after a page reload */
function resumePomodoro(){
  if(!S.pomoRunning || !S.pomoEndsAt) return;
  if(S.pomoEndsAt <= Date.now()){ S.pomoRunning = false; save(); return; }
  showPomo();
  runPomoTick();
}

/* ---------------------------------------------------------------------
   VISION BOARD — visual goals
   --------------------------------------------------------------------- */
function toggleVision(id){
  if(S.vision.includes(id)){
    S.vision = S.vision.filter(v => v !== id);
  } else {
    S.vision.push(id);
  }
  save();
  renderAll();
}

/* ---------------------------------------------------------------------
   EGG SYSTEM — passive. Eggs are earned by playing, opened in one click.
   No XP cost. No confirm dialog. No grind.
   --------------------------------------------------------------------- */
function giveEgg(tier, reason){
  if(!S.eggs) S.eggs = {};
  const egg = EGG_TYPES.find(e => e.tier === tier) || EGG_TYPES[0];
  S.eggs[egg.id] = (S.eggs[egg.id] || 0) + 1;
  S.eggsTotal = (S.eggsTotal || 0) + 1;
  sfx('loot');
  log('EGG FOUND', '<b>' + egg.name + '</b> earned' + (reason ? ' \u2014 ' + reason : '') + '.');
  save();
}

function eggCount(){
  if(!S.eggs) return 0;
  return Object.values(S.eggs).reduce((a,b) => a + b, 0);
}

/* called from every mission completion — passive egg income */
function checkEggDrops(){
  const today = dayKey();
  if(S.eggDay !== today){ S.eggDay = today; S.eggMissionsToday = 0; }

  S.eggMissionsToday = (S.eggMissionsToday || 0) + 1;
  S.eggMissionTotal = (S.eggMissionTotal || 0) + 1;

  /* every 5 missions cleared today -> one Basic egg */
  if(S.eggMissionsToday % EGG_DROPS.missionsPerEgg === 0){
    giveEgg(1, 'cleared ' + S.eggMissionsToday + ' missions today');
  }
  /* every 7 days of streak -> one Premium egg */
  if(S.streak > 0 && S.streak % EGG_DROPS.streakEvery === 0 && S.eggStreakMark !== S.streak){
    S.eggStreakMark = S.streak;
    giveEgg(2, S.streak + '-day streak');
  }
  /* every 25 levels -> one Monarch egg */
  if(S.level > 0 && S.level % EGG_DROPS.levelEvery === 0 && S.eggLevelMark !== S.level){
    S.eggLevelMark = S.level;
    giveEgg(4, 'reached level ' + S.level);
  }
  save();
}

/* ---- opening: one click, no cost, no confirmation ---- */
function openEgg(eggId){
  if(!S.eggs || !S.eggs[eggId]) return;
  const egg = EGG_TYPES.find(e => e.id === eggId);
  if(!egg) return;

  S.eggs[eggId]--;
  if(S.eggs[eggId] <= 0) delete S.eggs[eggId];

  const result = rollCharacter(egg);
  save();
  renderAll();
  return result;
}

function openAllEggs(){
  const total = eggCount();
  if(!total){ sfx('error'); return; }
  const results = [];
  /* open in tier order so the best pulls are seen last */
  EGG_TYPES.slice().sort((a,b) => a.tier - b.tier).forEach(egg => {
    while(S.eggs && S.eggs[egg.id] > 0){
      results.push(openEgg(egg.id));
    }
  });
  if(results.length){
    showEggResults(results);
  }
  save();
  renderAll();
}

/* ---- the actual pull ---- */
function rollCharacter(egg){
  const roll = Math.random() * 100;
  let rarity = 'common';
  let cumulative = 0;
  for(const [r, chance] of Object.entries(egg.chances)){
    cumulative += chance;
    if(roll <= cumulative){ rarity = r; break; }
  }

  const pool = SHADOW_CHARACTERS.filter(c => c.rarity === rarity);
  const char = pool[Math.floor(Math.random() * pool.length)];

  const owned = S.shadowChars.find(c => c.id === char.id);
  if(owned){
    if(owned.star >= MAX_STARS){
      return {char:char, type:'maxed', star:owned.star, power:owned.power};
    }
    owned.star++;
    owned.power = char.power + (owned.star - 1) * STAR_BONUS;
    return {char:char, type:'star', star:owned.star, power:owned.power};
  }
  S.shadowChars.push({id:char.id, star:1, power:char.power});
  return {char:char, type:'new', star:1, power:char.power};
}

/* ---- the reveal: one card, all pulls, tap to dismiss ---- */
function showEggResults(results){
  if(!results || !results.length) return;

  const best = results.reduce((a,b) =>
    (RARITY_ORDER[b.char.rarity] > RARITY_ORDER[a.char.rarity]) ? b : a, results[0]);
  const isMythic = best.char.rarity === 'mythic';
  const isLegend = RARITY_ORDER[best.char.rarity] >= 4;

  if(isMythic) sfx('mythic');
  else if(isLegend) sfx('gem');
  else sfx('success');

  const el = document.createElement('div');
  el.className = 'eggReveal' + (isLegend ? ' rare' : '') + (isMythic ? ' mythic' : '');
  el.innerHTML =
      '<div class="erInner">'
    +   '<div class="erHead">' + (results.length > 1 ? results.length + ' EGGS OPENED' : 'EGG OPENED') + '</div>'
    +   '<div class="erGrid">'
    +     results.map(r => {
          const c = r.char;
          const col = RARITY_COLOR[c.rarity];
          const tag = r.type === 'new' ? 'NEW' : (r.type === 'maxed' ? 'MAX \u2605' + MAX_STARS : '\u2605' + r.star);
          const eggImg = c.img
            ? '<img src="' + c.img + '" alt="' + esc(c.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" loading="lazy">'
            : '';
          const eggFallback = '<div class="erFallback icoWrap"' + (c.img ? ' style="display:none"' : '') + ' style="width:100%;aspect-ratio:1;display:flex;align-items:center;justify-content:center;margin-bottom:9px">' + ic(c.icon || 'soldier', 48) + '</div>';
          return '<div class="erCard' + (RARITY_ORDER[c.rarity] >= 4 ? ' big' : '') + '" style="border-color:' + col + '">'
            + eggImg
            + eggFallback
            + '<div class="erName" style="color:' + col + '">' + c.name + '</div>'
            + '<div class="erRar" style="color:' + col + '">' + RARITY_LABEL[c.rarity] + '</div>'
            + '<div class="erTag">' + tag + '</div>'
            + '</div>';
        }).join('')
    +   '</div>'
    +   '<div class="erClose">tap anywhere to continue</div>'
    + '</div>';

  el.onclick = () => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 400);
  };
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));

  const names = results.map(r => r.char.name + (r.type === 'new' ? ' (NEW)' : ' \u2605' + r.star));
  log('EGG', 'Opened ' + results.length + ': <b>' + names.join(', ') + '</b>');
  if(isLegend) setTimeout(() => fireworks(120), 400);
}

/* ---------------------------------------------------------------------
   SHADOW CHARACTERS — your collection
   --------------------------------------------------------------------- */
function upgradeCharacter(charId){
  const owned = S.shadowChars.find(c => c.id === charId);
  if(!owned) return;
  const char = SHADOW_CHARACTERS.find(c => c.id === charId);
  if(!char) return;
  const cost = owned.star * 150;
  if(S.xp < cost){ sfx('error'); alert('Not enough XP. Upgrade costs ' + cost + ' XP.'); return; }
  if(!confirm('Upgrade ' + char.name + ' to level ' + (owned.star + 1) + ' for ' + cost + ' XP?')) return;

  S.xp -= cost;
  S.level = Math.floor(S.xp/LEVEL_XP) + 1;
  sfx('spend');
  setTimeout(()=>sfx('merge'), 200);
  owned.power += 5;

  overlay('UPGRADED', ic(char.icon,54) + ' ' + char.name, 'Power ' + owned.power + '. \u2605' + owned.star + ' character.', false);
  log('UPGRADE', char.name + ' upgraded. Power ' + owned.power + '.');
  save();
  renderAll();
}

/* Vocabulary unified in vocab.js */

function save(){
  if(typeof S === 'undefined' || !S) return;
  if(!S.speaking) S.speaking = {wordsDone:[], recordings:[]};
  if(!S.expenses) S.expenses = {};
  if(!S.uptodate) S.uptodate = {readNews:[]};
  if(!S.daily) S.daily = {};
  if(!S.dailyHistory) S.dailyHistory = {};
  if(!S.habitsToday) S.habitsToday = {};
  if(!S.habitHistory) S.habitHistory = {};

  S.lastModified = Date.now();
  if(typeof StorageManager !== 'undefined' && StorageManager.save){
    StorageManager.save(S).catch(()=>{});
  } else {
    try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){}
  }
  cloudSave();
}

/* ---------------------------------------------------------------------
   AUTO-UPDATE SYSTEM — checks for new features and applies them
   --------------------------------------------------------------------- */
const APP_VERSION = 23;
function checkForUpdates(){
  const lastVer = parseInt(localStorage.getItem('soloAppVer') || '0', 10);
  if(lastVer >= APP_VERSION) return;

  /* ------------------------------------------------------------------
     v23 — NEVER DESTROY XP.

     The v22 block rebuilt S.xp from missions only. It ran whenever
     soloAppVer was missing or older than APP_VERSION, which happens on
     every device where localStorage was cleared, on a new browser, or in
     a private window — and it silently wiped every XP source except
     missions, perfect days, books and vocab. Measured on a real save:
     6896 XP -> 1574 XP, i.e. 77% of a player's progress, and the damage
     was pushed to the cloud and saved permanently.

     We still want a fresh player (no save, no missions) to start at 0.
     So the recalculation only runs when there is genuinely nothing to
     lose — and it PRESERVES the existing ledger rather than replacing it.
     ------------------------------------------------------------------ */
  if(lastVer < 22){
    const hadProgress = !!(S.xp > 0 || Object.keys(S.daily||{}).length ||
                           Object.keys(S.weekly||{}).length ||
                           (S.boss && Object.keys(S.boss).length) ||
                           (S.courses && Object.keys(S.courses).length));

    if(hadProgress){
      /* keep the player's XP exactly as it is. Only make sure the ledger
         exists so the breakdown panel has something to show. */
      if(!S.xpSource || !Object.keys(S.xpSource).length) S.xpSource = {};
      S.level = Math.floor(S.xp / LEVEL_XP) + 1;
      log('UPDATE','System updated to version <b>'+APP_VERSION+'</b>. Your XP and progress were preserved.');
    } else {
      /* genuinely new player — nothing to rebuild, start clean */
      S.xp = 0;
      S.level = 1;
      S.xpSource = S.xpSource || {};
      S.missionXP = {};
    }
  }

  /* v23: make sure every XP source the app can award has a ledger key,
     so the breakdown always adds up. Purely additive — no XP is touched. */
  if(!S.xpSource) S.xpSource = {};
  S.xpSource.boss   = S.xpSource.boss   || 0;
  S.xpSource.habit  = S.xpSource.habit  || 0;
  S.xpSource.speaking = S.xpSource.speaking || 0;
  S.xpSource.manual = S.xpSource.manual || 0;

  localStorage.setItem('soloAppVer', APP_VERSION);
  save();
}

/* Daily Habits unified in habits.js */
function formedHabits(){ return []; }
function checkHabitFormation(){ return false; }

/* ---------------------------------------------------------------------
   MONEY TRACKER — practical ideas to earn from home until Riyadh.
   --------------------------------------------------------------------- */
const MONEY_IDEAS = [
  {id:'m1', n:'Freelance on Mostaql/Upwork', cat:'Freelance', diff:'Easy', time:'1-2 weeks',
   why:'You already have Meta ads experience. Offer campaign setup and management on Mostaql (Saudi platform) or Upwork. Start with small projects, build reviews, raise prices.',
   steps:['Create profile on Mostaql and Upwork','List 3 services you can offer (Meta Ads, GA4 setup, reporting)','Apply to 5 jobs daily for 1 week','Deliver excellent work to get 5-star reviews','Raise prices after 10 completed jobs']},
  {id:'m2', n:'Sell digital products on Gumroad', cat:'Digital', diff:'Medium', time:'2-4 weeks',
   why:'Create once, sell forever. Make a Meta Ads checklist, a GA4 setup guide, or a media buying template. You know this stuff — package it.',
   steps:['Pick one skill you are confident in','Create a checklist/template/guide (Canva is free)','List it on Gumroad for $10-25','Share on LinkedIn and Twitter','Iterate based on buyer feedback']},
  {id:'m3', n:'Content creation for Saudi brands', cat:'Content', diff:'Medium', time:'2-4 weeks',
   why:'Saudi brands need Arabic + English content. You understand the Gulf market. Offer social media management or content creation.',
   steps:['Identify 10 Saudi brands with weak social media','Create sample posts for 3 of them','Reach out with your samples','Offer a 1-month trial at a discount','Scale to monthly retainers']},
  {id:'m4', n:'Online tutoring (English/Meta)', cat:'Teaching', diff:'Easy', time:'1-2 weeks',
   why:'Your English is B1/C1. Teach English to Arabic speakers, or teach Meta ads to beginners. Platforms: Preply, Italki, or even WhatsApp groups.',
   steps:['Choose what to teach (English or Meta Ads)','Create a simple curriculum','List on Preply/Italki or advertise in Facebook groups','Offer first session free to get reviews','Charge $10-20/hour after 5 students']},
  {id:'m5', n:'Affiliate marketing', cat:'Affiliate', diff:'Medium', time:'1-3 months',
   why:'Recommend tools you already use (Canva, Make, hosting). Earn commission on every sale. Start with a LinkedIn post or a simple landing page.',
   steps:['Pick 3 tools you use and love','Sign up for their affiliate programs','Create content reviewing/comparing tools','Share on LinkedIn and Twitter','Track clicks and optimize']},
  {id:'m6', n:'Remote part-time for a company', cat:'Remote Job', diff:'Hard', time:'1-2 months',
   why:'Many companies hire remote part-time. Your Meta ads experience is valuable. Look for "remote" + "media buyer" or "performance marketing" on LinkedIn and Indeed.',
   steps:['Update LinkedIn headline to include "Remote"','Set job alerts on LinkedIn and Indeed','Apply to 5 remote jobs daily','Tailor CV for each application','Follow up after 1 week']},
  {id:'m7', n:'Build a personal brand on LinkedIn', cat:'Brand', diff:'Easy', time:'Ongoing',
   why:'Post daily about what you are learning. Document your journey to Riyadh. People hire people they know. Your content attracts opportunities.',
   steps:['Post 1 LinkedIn post daily (even a short one)','Comment on 5 posts daily in your niche','Share your learning journey honestly','Engage with comments on your posts','Review monthly: what worked?']},
  {id:'m8', n:'Offer local services (social media)', cat:'Local', diff:'Easy', time:'1-2 weeks',
   why:'Local businesses need social media help. Offer to manage their Instagram/Facebook for a monthly fee. Start with 1-2 clients.',
   steps:['Identify 5 local businesses with weak social media','Create sample content for them','Offer 1-month trial at 500-1000 EGP','Deliver results and testimonials','Scale to 5+ clients at 2000-3000 EGP/month']}
];

function drawMoney(){
  const el = $('moneyList');
  if(!el) return;
  const ideas = MONEY_IDEAS;
  el.innerHTML = ideas.map(idea => {
    const progress = S.moneyProgress && S.moneyProgress[idea.id] || 0;
    const pct = Math.round(progress / idea.steps.length * 100);
    return '<div class="moneyCard">'
      + '<div class="moneyHead">'
      +   '<span class="moneyName">' + esc(idea.n) + '</span>'
      +   '<span class="moneyCat">' + esc(idea.cat) + '</span>'
      +   '<span class="moneyDiff">' + esc(idea.diff) + '</span>'
      + '</div>'
      + '<div class="moneyWhy">' + esc(idea.why) + '</div>'
      + '<div class="moneySteps">'
      +   idea.steps.map((step, i) =>
          '<div class="moneyStep' + (i < progress ? ' done' : '') + '">'
          + '<span class="msCheck">' + (i < progress ? '✓' : (i+1)) + '</span>'
          + '<span class="msText">' + esc(step) + '</span>'
          + '</div>'
        ).join('')
      + '</div>'
      + '<div class="moneyProgress">'
      +   '<div class="bar thin"><i style="width:' + pct + '%"></i></div>'
      +   '<span>' + progress + '/' + idea.steps.length + ' steps</span>'
      + '</div>'
      + '<div class="moneyActions">'
      +   '<button class="btn small" onclick="advanceMoneyStep(\'' + idea.id + '\')">Next Step</button>'
      +   '<button class="btn small" onclick="resetMoneyIdea(\'' + idea.id + '\')">Reset</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

function advanceMoneyStep(ideaId){
  S.moneyProgress = S.moneyProgress || {};
  S.moneyProgress[ideaId] = (S.moneyProgress[ideaId] || 0) + 1;
  const idea = MONEY_IDEAS.find(m => m.id === ideaId);
  if(idea && S.moneyProgress[ideaId] >= idea.steps.length){
    addXP(50, 'money', false, 'money');
    overlay('MONEY IDEA COMPLETE', idea.n, '+50 XP — You are building income from home!', false);
    log('MONEY', 'Completed: <b>' + esc(idea.n) + '</b> (+50 XP)');
  }
  save();
  renderAll();
}

function resetMoneyIdea(ideaId){
  S.moneyProgress = S.moneyProgress || {};
  S.moneyProgress[ideaId] = 0;
  save();
  renderAll();
}

/* ---------------------------------------------------------------------
   SKILL TREE — ordered by importance, with prerequisites.
   Complete a skill to unlock the ones that depend on it.
   --------------------------------------------------------------------- */
function isSkillUnlocked(skillId){
  const skill = SKILL_TREE.find(s => s.id === skillId);
  if(!skill) return false;
  if(!skill.requires || !skill.requires.length) return true;
  return skill.requires.every(req => !!(S.skillTree && S.skillTree[req]));
}

function completeSkill(skillId){
  const skill = SKILL_TREE.find(s => s.id === skillId);
  if(!skill) return;
  if(!isSkillUnlocked(skillId)){
    sfx('error');
    alert('This skill is locked. Complete the required skills first.');
    return;
  }
  if(S.skillTree && S.skillTree[skillId]){
    sfx('error');
    alert('You already completed this skill.');
    return;
  }
  S.skillTree = S.skillTree || {};
  S.skillTree[skillId] = true;
  save();
  sfx('badge');
  overlay('SKILL COMPLETED', skill.n, 'You unlocked new skills. Check the Skill Tree.', false);
  log('SKILL', 'Completed: <b>' + skill.n + '</b>.');
  renderAll();
}

function getNextSkill(){
  const available = SKILL_TREE.filter(s => isSkillUnlocked(s.id) && !(S.skillTree && S.skillTree[s.id]));
  if(!available.length) return null;
  return available.sort((a,b) => a.priority - b.priority)[0];
}

/* ---------------------------------------------------------------------
   COURSE TREE — same lock/unlock system as skills, for courses.
   --------------------------------------------------------------------- */
function isCourseUnlocked(courseId){
  const course = COURSES.find(c => c.id === courseId);
  if(!course) return false;
  if(!course.requires || !course.requires.length) return true;
  return course.requires.every(req => !!(S.courses && S.courses[req]));
}

function completeCourseById(courseId){
  const course = COURSES.find(c => c.id === courseId);
  if(!course) return;
  if(!isCourseUnlocked(courseId)){
    sfx('error');
    alert('This course is locked. Complete the required courses first.');
    return;
  }
  if(S.courses[courseId]){
    sfx('error');
    alert('You already completed this course.');
    return;
  }
  S.courses[courseId] = true;
  addXP(60, 'selfdev', false, 'course');
  log('COURSE','Completed: <b>'+course.name+'</b> (+60 XP)');
  save();
  sfx('badge');
  overlay('COURSE COMPLETED', course.name, '+60 XP · Check what unlocked!', false);
  renderAll();
}

function getNextCourse(){
  const available = COURSES.filter(c => isCourseUnlocked(c.id) && !S.courses[c.id]);
  if(!available.length) return null;
  /* stage 1 first, then by array order */
  return available.sort((a,b) => (a.stage||9) - (b.stage||9))[0];
}
/* ---------------------------------------------------------------------
   CLOUD SYNC — push/pull progress to JSONBin.io so all devices share
   the same save. LocalStorage stays as the fast local cache.
   --------------------------------------------------------------------- */
function cloudSave(){
  if(typeof IS_DEV_MODE !== 'undefined' && IS_DEV_MODE) return; /* DEV ISOLATION */
  const cfg = getCloudSyncConfig();
  if(!cfg.enabled) return; /* Pure local-first: no-op if no credentials provided */
  if(typeof fetch === 'undefined') return;
  /* SAFETY GUARD: NEVER overwrite authentic cloud data with empty or reset save! */
  if(!S || !S.started || S.xp < 1000 || S.streak < 10) return;
  try{
    fetch(cfg.url, {
      method:'PUT',
      headers:{'Content-Type':'application/json','X-Master-Key':cfg.key},
      body: JSON.stringify(S)
    }).catch(()=>{});
  }catch(e){}
}

function cloudLoad(){
  if(typeof IS_DEV_MODE !== 'undefined' && IS_DEV_MODE) return Promise.resolve(false); /* DEV ISOLATION */
  const cfg = getCloudSyncConfig();
  if(!cfg.enabled) return Promise.resolve(false); /* Pure local-first */
  if(typeof fetch === 'undefined') return Promise.resolve(false);
  return fetch(cfg.url + '/latest', {
    headers:{'X-Master-Key':cfg.key}
  }).then(r=>r.json()).then(j=>{
    if(j && j.record && j.record.xp !== undefined){
      const cloud = j.record;
      /* the most recently changed save wins. XP is the tiebreaker. */
      const cloudTime = cloud.lastModified || 0;
      const localTime = S.lastModified || 0;

      /* Cloud wins if:
         1. Cloud has more XP than local, OR
         2. Local has low progress (<1000) while cloud has full progress, OR
         3. Cloud streak is higher, OR
         4. Cloud was modified after local
      */
      const localIsFresh = !S.started || S.xp < 1000 || (S.streak < 10 && cloud.streak >= 10);
      const cloudWins = localIsFresh || (cloud.xp > S.xp) || (cloud.streak > S.streak) || (cloudTime > localTime) || (cloudTime === localTime && cloud.xp >= S.xp);
      if(cloudWins){
        /* merge: keep all new blank() fields, override with cloud data */
        const fresh = blank();
        S = Object.assign(fresh, cloud);
        /* ensure all new fields exist even if cloud has old data */
        if(!S.speaking) S.speaking = {wordsDone:[], recordings:[]};
        if(!S.expenses) S.expenses = {};
        if(!S.uptodate) S.uptodate = {readNews:[]};
        if(!S.habits) S.habits = {};
        if(!S.habitDays) S.habitDays = {};
        if(!S.formedHabits) S.formedHabits = {};
        if(!S.moneyProgress) S.moneyProgress = {};
        if(!S.projects) S.projects = {};
        if(!S.customTasks) S.customTasks = [];
        if(!S.taskStatus) S.taskStatus = {};
        if(!S.lifeStatus) S.lifeStatus = {
          location: 'Cairo, Egypt',
          destination: 'Saudi Arabia (Riyadh / Jeddah)',
          travelStatus: 'imminent',
          targetTravelDate: 'Late November 2026',
          expensesPaid: true,
          flightBooked: false,
          flightDetails: '',
          documentsReady: true,
          saudiPhone: false,
          saudiPhoneNumber: '',
          currentDifficulty: 1,
          difficultyName: 'Level 1 — Normal',
          activeBossFocus: 'b2',
          checkinHistory: []
        };
        if(!S.foundationProfile) S.foundationProfile = {
          dayIndex: 1,
          foundationActive: true,
          recoveryMode: false,
          totalMandatoryMinutes: 220,
          englishAssessed: false,
          englishEstimatedLevel: 'B1/B2',
          completedFoundationDays: 0,
          weeklyReviewsCount: 0
        };
        S.level = Math.floor(S.xp / LEVEL_XP) + 1;
        S.ver = 6;
        try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){}
        return true;
      }
    }
    return false;
  }).catch(()=>false);
}
/* ---------------------------------------------------------------------
   DATE & TIMEZONE HELPERS
   --------------------------------------------------------------------- */
const CAIRO_TZ = 'Africa/Cairo';
function dayKey(d){ return typeof SystemClock !== 'undefined' ? SystemClock.dayKey(d) : new Date(d || Date.now()).toISOString().slice(0,10); }
function getCairoHour(d){
  if(typeof SystemClock !== 'undefined'){ return parseInt(SystemClock.getCairoParts(d).hour, 10) || 0; }
  return (d ? new Date(d) : new Date()).getHours();
}
function getCairoDayOfWeek(d){
  if(typeof SystemClock !== 'undefined'){
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return map[SystemClock.getCairoParts(d).weekday] ?? 0;
  }
  return (d ? new Date(d) : new Date()).getDay();
}
function weekKey(d){ return typeof SystemClock !== 'undefined' ? SystemClock.weekKey(d) : dayKey(d); }
function daysBetween(a,b){ return typeof SystemClock !== 'undefined' ? SystemClock.daysBetween(a, b) : 0; }

/* ---------------------------------------------------------------------
   THE SYSTEM ONLY JUDGES YOU ONCE YOU HAVE STARTED.
   Before the first mission is ever completed, no penalty applies.
   --------------------------------------------------------------------- */
/* Rollover delegated exclusively to TaskEngine.processDailyRollover() */
function resets(){
  if(typeof TaskEngine !== 'undefined' && TaskEngine.processDailyRollover){
    return TaskEngine.processDailyRollover({ quiet: true });
  }
}
function consequenceWarning(){ return null; }
function weeklyConsequence(){ return null; }
function judgeDay(){ return null; }
function checkPerfectDay(){}
function unbankPerfectDay(){ return false; }

/* ---------------------------------------------------------------------
   CEREMONIES — every level feels like something
   --------------------------------------------------------------------- */
function levelCeremony(from, to){
  const gained = to - from;

  /* a multi-level jump can skip over a milestone — catch every one it crossed */
  const crossed = [];
  for(let lv = from + 1; lv <= to; lv++){
    if(MILESTONES[lv]) crossed.push({lv:lv, label:MILESTONES[lv]});
  }
  const isMilestone = crossed.length > 0;
  const rank = RANKS[rankIdx(S.xp)];

  /* the level-up card */
  setTimeout(()=>{
    ceremonyCard({
      kicker:'LEVEL UP',
      big:'LEVEL ' + to,
      sub: isMilestone
        ? crossed.map(c=>c.label).join(' \u00b7 ')
        : 'Your strength has increased. Level ' + to + ' of 100.',
      stat:'You are <b>' + S.level + '</b> levels deep. Rank: <b>' + rank.name + '</b>.',
      rare: !!isMilestone
    });
  }, 400);

  /* each milestone crossed gets its own beat */
  crossed.forEach((c, i) => {
    setTimeout(()=>{
      fireworks(110);
      fanfare();
      log('MILESTONE','<b>' + c.label + '</b> reached at level ' + c.lv + '.');
    }, 2800 + i*2600);
  });

  /* multi-level jumps are rare and should feel rare */
  if(gained >= 2){
    setTimeout(()=>{
      ceremonyCard({
        kicker:'MULTI LEVEL',
        big:'+' + gained + ' LEVELS',
        sub:'From level ' + from + ' straight to ' + to + '.',
        stat:'That is not a normal day. Remember what you did today.',
        rare:true
      });
    }, 2800 + crossed.length*2600);
  }

  log('LEVEL UP','Reached <b>level '+to+'</b>.');
}

function rankCeremony(from, to){
  const newRank = RANKS[to];

  /* a full-screen rank ceremony — this is the big one */
  setTimeout(()=>{
    rankScreen(newRank, from, to);
  }, 400);
}

function checkBadges(){
  let awarded = false;
  BADGES.forEach(b => {
    if(S.badges.includes(b.id)) return;
    if(!b.test(S)) return;
    S.badges.push(b.id);
    awarded = true;
    setTimeout(()=>{
      ceremonyCard({
        kicker:'BADGE EARNED',
        big:ic(b.icon,46) + '  ' + b.name,
        sub:b.desc,
        stat:'Recorded permanently in your Status window.',
        rare:true
      });
      log('BADGE','<b>'+b.name+'</b> earned.');
    }, 3200);
  });
  if(awarded){ save(); drawBadges(); }
}

/* subXP & addXP provided authoritatively by core_xp.js */
function checkUnlocks(oldLevel){
  for(const t in TIER_LEVELS){
    const need = TIER_LEVELS[t];
    if(oldLevel < need && S.level >= need){
      setTimeout(()=>overlay('NEW MISSIONS','TIER '+t, GUIDE_BY_TIER[t], false), 1400);
      log('UNLOCK','Tier '+t+' missions are now available.');
    }
  }
  for(const st in STAGE_LEVELS){
    const need = STAGE_LEVELS[st];
    if(oldLevel < need && S.level >= need){
      const n = COURSES.filter(c=>String(c.stage)===String(st)).length;
      setTimeout(()=>overlay('COURSE TRACK','STAGE '+st,
        n+' new courses unlocked. Free, and chosen for your actual gaps.', false), 1900);
      log('UNLOCK','Course stage '+st+' unlocked ('+n+' courses).');
    }
  }
}

function rankIdx(xp){
  let i = 0;
  for(let k=0;k<RANKS.length;k++) if(xp >= RANKS[k].xp) i = k;
  return i;
}

/* ---------------------------------------------------------------------
   STARTING THE SYSTEM
   --------------------------------------------------------------------- */
function startSystem(){
  S.started = true;
  S.startedOn = dayKey();
  S.lastActive = dayKey();
  S.streak = 1;
  S.best = Math.max(S.best, 1);
  S.penaltyDay = '';
  save();
  overlay('SYSTEM AWAKENED','DAY 1','The System is now active. From tomorrow, missed missions carry a penalty.', false);
  log('SYSTEM','You have started. Day 1 logged. Streak begins.');
  renderAll();
}

/* ---------------------------------------------------------------------
   STREAK
   --------------------------------------------------------------------- */
function markActive(){
  if(typeof S !== 'undefined' && S) S.lastActive = dayKey();
}

function buyFreeze(){
  if(S.freezes >= FREEZE.max){ alert('You already hold the maximum of '+FREEZE.max+' freezes.'); return; }
  if(S.xp < FREEZE.costXP){ alert('Not enough XP. A freeze costs '+FREEZE.costXP+' XP.'); return; }
  if(!confirm('Spend '+FREEZE.costXP+' XP on a streak freeze?')) return;
  if(typeof XpEngine !== 'undefined'){
    XpEngine.reverseXP({ amount: FREEZE.costXP, source: 'freeze', type: 'FREEZE_PURCHASE', reason: 'Purchased streak freeze' });
  } else {
    S.xp = Math.max(0, S.xp - FREEZE.costXP);
    S.level = Math.max(1, Math.floor(S.xp / LEVEL_XP) + 1);
  }
  S.freezes++;
  save();
  log('FREEZE','Purchased a streak freeze. You hold <b>'+S.freezes+'</b>.');
  renderAll();
}

function getWeeklyCycleIndex(){
  const start = (S && S.startedOn) ? S.startedOn : '2026-10-06';
  const days = Math.max(0, daysBetween(start, dayKey()));
  return Math.floor(days / 7);
}

function getActiveWeeklyBoss(){
  if(typeof WEEKLY_RAID_BOSSES === 'undefined' || !WEEKLY_RAID_BOSSES.length) return null;
  const cycleIdx = getWeeklyCycleIndex() % WEEKLY_RAID_BOSSES.length;
  return WEEKLY_RAID_BOSSES[cycleIdx];
}

function isMissionActiveToday(m){
  return true;
}

function isMissionActiveThisWeek(m){
  if(S && S.weekly && S.weekly[m.id]) return true;
  if(typeof m.cycle === 'number'){
    const currentCycle = getWeeklyCycleIndex() % 4;
    return m.cycle === currentCycle;
  }
  return true;
}

function available(list){
  if(list === DAILY && typeof TaskEngine !== 'undefined' && TaskEngine.getDailyMissions){
    return TaskEngine.getDailyMissions();
  }
  return list.filter(m => {
    if(m.unlock && S.level < m.unlock.level) return false;
    if(list === WEEKLY && !isMissionActiveThisWeek(m)) return false;
    return true;
  });
}

function lockedOf(list){
  return list.filter(m => {
    if(!m.unlock || S.level >= m.unlock.level) return false;
    if(list === WEEKLY && !isMissionActiveThisWeek(m)) return false;
    return true;
  });
}

function toggleWeeklyBossPhase(bossId, phaseIdx){
  if(!S.weeklyBoss) S.weeklyBoss = {};
  if(!S.weeklyBoss[bossId]) S.weeklyBoss[bossId] = [false, false, false, false];
  const b = typeof WEEKLY_RAID_BOSSES !== 'undefined' ? WEEKLY_RAID_BOSSES.find(x => x.id === bossId) : null;
  if(!b || !b.phases || !b.phases[phaseIdx]) return;

  const phase = b.phases[phaseIdx];
  const current = !!S.weeklyBoss[bossId][phaseIdx];
  const sid = 'wboss:' + weekKey() + ':' + bossId + ':' + phaseIdx;

  if(current){
    S.weeklyBoss[bossId][phaseIdx] = false;
    if(typeof XpEngine !== 'undefined') XpEngine.reverseXP({ sourceId: sid, stat: 'skills', source: 'boss', reason: phase.text });
    sfx('uncheck');
  } else {
    S.weeklyBoss[bossId][phaseIdx] = true;
    if(typeof XpEngine !== 'undefined') XpEngine.grantXP({ amount: phase.xp, baseXP: phase.xp, stat: 'skills', source: 'boss', sourceId: sid, type: 'BOSS_PHASE', reason: phase.text });
    sfx('mission');
    if(S.weeklyBoss[bossId].every(Boolean)){
      if(typeof XpEngine !== 'undefined') XpEngine.grantXP({ amount: b.reward, baseXP: b.reward, stat: 'skills', source: 'boss', sourceId: 'wboss_clear:' + weekKey() + ':' + bossId, isBonus: true, type: 'BOSS_CLEAR', reason: b.name });
      sfx('levelup');
      overlay('WEEKLY GATE CONQUERED!', b.name, 'Bonus Loot: +' + b.reward + ' XP earned!');
    }
  }
  save();
  if(typeof drawHUD === 'function') drawHUD();
  if(typeof drawWeekly === 'function') drawWeekly();
}

function toggleWeeklyMission(id, ev){
  if(ev && ev.stopPropagation) ev.stopPropagation();
  const m = typeof WEEKLY !== 'undefined' ? WEEKLY.find(x => x.id === id) : null;
  if(!m) return;
  if(m.unlock && S.level < m.unlock.level) return;
  if(!S.weekly) S.weekly = {};
  const sid = 'weekly:' + weekKey() + ':' + id;

  if(S.weekly[id]){
    delete S.weekly[id];
    if(typeof XpEngine !== 'undefined') XpEngine.reverseXP({ sourceId: sid, stat: m.stat, source: 'mission', reason: m.name });
    S.qDone = Math.max(0, (S.qDone || 0) - 1);
    sfx('uncheck');
  } else {
    S.weekly[id] = true;
    S.qDone = (S.qDone || 0) + 1;
    let gained = m.xp;
    if(typeof XpEngine !== 'undefined'){
      const res = XpEngine.grantXP({ amount: m.xp, baseXP: m.xp, stat: m.stat, source: 'mission', sourceId: sid, type: 'WEEKLY_COMPLETION', reason: m.name });
      if(res.granted) gained = res.finalXP;
    }
    sfx('mission');
    if(ev && ev.clientX && typeof floatXP === 'function') floatXP(ev.clientX, ev.clientY, gained, false);
  }
  save();
  if(typeof drawHUD === 'function') drawHUD();
  if(typeof drawWeekly === 'function') drawWeekly();
}

function toggleMission(kind, id, ev){
  if(kind === 'weekly') return toggleWeeklyMission(id, ev);
  if(typeof TaskEngine !== 'undefined' && TaskEngine.toggleTask) return TaskEngine.toggleTask(id, ev);
  return false;
}

/* ---------------------------------------------------------------------
   BOSS RAID STEPS
   --------------------------------------------------------------------- */
function toggleStep(bossId, i){
  const b = BOSSES.find(x => x.id === bossId);
  if(!b) return;
  if(!S.boss[bossId]) S.boss[bossId] = b.steps.map(()=>false);

  // GATING CHECK FOR BOSS RAID 02 (Saudi Arabia Professional Transition)
  // Steps 9-14 correspond to Stage 3: Professional Job Search
  if(bossId === 'b2' && i >= 9 && (!S.lifeStatus || !S.lifeStatus.saudiPhone)){
    alert("⚠️ [SYSTEM GATE: STAGE 3 LOCKED]\n\nStage 3: Professional Job Search is locked until you arrive in Saudi Arabia and confirm your local Saudi phone number in the Life Command Center.\n\nSubmitting applications without a local Saudi phone number drastically lowers response rates. Focus on CV tailoring, case studies, and out-loud English defense drills first!");
    return;
  }

  const on = !S.boss[bossId][i];
  S.boss[bossId][i] = on;

  if(on){
    S.sDone++;
    S.bossXp = true;
    addXP(b.xp, null, true, 'boss');
    S.bossXp = false;
    log('RAID','<b>'+b.name+'</b> &mdash; '+b.steps[i] + ' <b>+'+b.xp+' XP</b>');
    if(typeof reactTo === 'function') reactTo('bossStep');

    // SYSTEMIC UNLOCK TRIGGERS
    if(!S.systemUnlocks) S.systemUnlocks = [];
if(!S.foundationProfile){
  S.foundationProfile = {
    dayIndex: 1,
    foundationActive: true,
    recoveryMode: false,
    totalMandatoryMinutes: 220,
    englishAssessed: false,
    englishEstimatedLevel: 'B1/B2',
    completedFoundationDays: 0,
    weeklyReviewsCount: 0
  };
}
    S.systemUnlocks.unshift({
      bossId: bossId,
      bossName: b.name,
      stepIndex: i,
      stepText: b.steps[i],
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    });

    // Special trigger: Stage 2 step 6 (index 6: Obtain local Saudi mobile SIM)
    if(bossId === 'b2' && i === 6){
      if(!S.lifeStatus) S.lifeStatus = {};
      S.lifeStatus.saudiPhone = true;
      setTimeout(()=>{
        if(typeof ceremonyCard === 'function'){
          ceremonyCard({
            kicker: 'SYSTEM MILESTONE UNLOCKED',
            big: 'Stage 3: Saudi Job Search Activated!',
            sub: 'Local Saudi phone number verified. Direct application and outreach quests are now unlocked.',
            stat: 'Unlocked: Riyadh & Jeddah direct agency recruitment pipelines',
            rare: true
          });
        }
      }, 500);
      log('SYSTEM UNLOCK', '<b>Stage 3 Unlocked:</b> Saudi phone number active. Job search gates cleared.');
    }

    // Special trigger: Content Boss b3 step 4 (Master video scripting)
    if(bossId === 'b3' && i === 4){
      log('SKILL UNLOCKED', '<b>Video Scripting Mastered:</b> Advanced talking-head video production quests now available.');
    }

    // Special trigger: AI Boss b4 step 1 (Master prompt engineering)
    if(bossId === 'b4' && i === 0){
      log('AUTOMATION UNLOCKED', '<b>Prompt Engineering Certified:</b> Multi-step AI agent workflows enabled.');
    }

    if(bossDone(bossId)){
      const bonus = b.reward || 0;
      setTimeout(()=>{
        ceremonyCard({
          kicker:'BOSS RAID CLEARED',
          big:b.name,
          sub:'Every milestone conquered. The raid is finished.',
          stat: bonus ? 'Completion bonus: <b>+'+bonus.toLocaleString()+' XP</b>' : 'The raid is complete.',
          rare:true
        });
        if(bonus) addXP(bonus, null, true, 'boss');
        log('BOSS CLEARED','<b>'+b.name+'</b> has fallen.' + (bonus ? ' <b>+'+bonus.toLocaleString()+' XP</b> bonus.' : ''));
        if(typeof reactTo === 'function') reactTo('bossComplete');
      }, 700);
    }
  } else {
    S.sDone = Math.max(0, S.sDone - 1);
    subXP(b.xp, null, 'boss');
  }
  save();
  renderAll();
}

function bossDone(id){
  const b = BOSSES.find(x => x.id === id);
  if(!b) return false;
  const st = S.boss[id] || [];
  return b.steps.every((_, i) => st[i]);
}
function bossPct(id){
  const b = BOSSES.find(x => x.id === id);
  const st = S.boss[id] || [];
  return Math.round(st.filter(Boolean).length / b.steps.length * 100);
}

/* ---------------------------------------------------------------------
   STATS
   --------------------------------------------------------------------- */
function statLevel(key){
  const xp = S.statXP[key] || 0;
  return Math.min(10, Math.floor(xp/STAT_XP) + 1);
}
/* real level = the honest starting point + progress earned in the app */
function statOverall(key){
  const st = STATS.find(s => s.key === key);
  return Math.min(10, (st ? st.start : 1) + statLevel(key) - 1);
}

/* ---------------------------------------------------------------------
   COURSES
   --------------------------------------------------------------------- */
function courseOpen(c){ return S.level >= (STAGE_LEVELS[c.stage] || 1); }
function toggleCourse(id){
  const c = COURSES.find(x => x.id === id);
  if(!c || !courseOpen(c)) return;
  if(S.courses[id]){
    delete S.courses[id];
    subXP(60, 'selfdev', 'course');
  } else {
    S.courses[id] = true;
    addXP(60, 'selfdev', false, 'course');
    log('COURSE','Completed: <b>'+c.name+'</b> (+60 XP)');
    if(typeof reactTo === 'function') reactTo('courseDone');
  }
  save();
  renderAll();
}

/* ---------------------------------------------------------------------
   REWARDS — every one written by Hadi
   --------------------------------------------------------------------- */
function rewardOpen(r){
  if(r.unlockType === 'level')  return S.level  >= r.value;
  if(r.unlockType === 'streak') return S.streak >= r.value;
  return S.xp >= r.value;
}

function claimReward(id){
  const r = S.rewards.find(x => x.id === id);
  if(!r || !rewardOpen(r) || r.claimed) return;
  r.claimed = true;
  r.claimedOn = new Date().toLocaleDateString();
  save();
  overlay('REWARD CLAIMED', r.name, 'Take it for real. You earned it.', false);
  log('REWARD','Claimed: <b>'+r.name+'</b>.');
  renderAll();
}

/* ---------------------------------------------------------------------
   BOOKS — mark as read, earn XP
   --------------------------------------------------------------------- */
function bookKey(cat, title){ return (cat + '|' + title).replace(/[^A-Za-z0-9|]/g,'_'); }

function allBooks(){
  const out = [];
  BOOKS.forEach(c => c.items.forEach(b => out.push({
    key: bookKey(c.cat, b.t), cat: c.cat, t: b.t, a: b.a, xp: b.xp || 150
  })));
  return out;
}

function toggleBook(key){
  const bk = allBooks().find(b => b.key === key);
  if(!bk) return;
  if(!S.books) S.books = {};

  if(S.books[key]){
    delete S.books[key];
    subXP(bk.xp, 'selfdev', 'bonus');
    beep(300,.1,'sawtooth');
  } else {
    S.books[key] = dayKey();
    addXP(bk.xp, 'selfdev', true, 'bonus');
    setTimeout(()=>{
      ceremonyCard({
        kicker:'BOOK FINISHED',
        big:bk.t,
        sub:'Read and completed. Knowledge is the one thing nobody can take from you.',
        stat:'<b>+'+bk.xp+' XP</b>',
        rare:true
      });
      log('BOOK','Finished <b>'+bk.t+'</b>. <b>+'+bk.xp+' XP</b>.');
    }, 400);
  }
  save();
  renderAll();
}

function booksRead(){ return S.books ? Object.keys(S.books).length : 0; }

/* ---------------------------------------------------------------------
   SMART GUIDE — picks a line based on what is actually happening
   --------------------------------------------------------------------- */
let lastLine = '';
function smartPhrase(){
  /* player's own line always wins */
  if(S.customPhrase) return S.customPhrase;

  /* event-driven lines take priority over everything else */
  if(currentEvent && EVENT_PHRASES[currentEvent]){
    const lines = EVENT_PHRASES[currentEvent];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  /* ------------------------------------------------------------------
     FIXED WHY/GOAL/DREAM SLOTS — Jin-Woo reminds him on a schedule.

     These are checked FIRST but only apply in their own time window, so
     a missed streak or an outstanding debt still gets priority later in
     the function. Outside the window they fall through to the normal
     contextual rotation, which still contains a small chance of a
     WHY/GOAL/DREAM line.
     ------------------------------------------------------------------ */
  const hr = getCairoHour();
  const slot = Math.floor(Date.now() / (3 * 60 * 60 * 1000));
  let timeLine = null;
  if(hr >= 4 && hr < 9  && slot % 2 === 0) timeLine = pickLine(WHY_LINES);    /* morning: WHY */
  else if(hr >= 20 && slot % 2 === 0)      timeLine = pickLine(GOAL_LINES);  /* night: GOAL */
  else if(hr >= 12 && hr < 15 && slot % 3 === 0) timeLine = pickLine(DREAM_LINES);

  /* the reminder lines take priority over the generic contextual ones —
     they are what he asked for, and they only fire in their window */
  if(timeLine) return timeLine;

  const av = available(DAILY);
  const done = av.filter(m => S.daily[m.id]).length;
  const pct = av.length ? done/av.length : 0;

  /* away for a while? that outranks everything */
  if(S.lastActive){
    const gap = daysBetween(S.lastActive, dayKey());
    if(gap >= 3) return GUIDE_CONTEXT.longAway;
  }

  /* not started yet */
  if(!S.started) return GUIDE_CONTEXT.notStarted;

  /* today's progress is the strongest signal */
  if(pct === 1 && av.length) return GUIDE_CONTEXT.perfectDay;

  /* a broken streak matters more than anything else on the screen */
  if(S.lastActive && S.streak === 0 && S.best > 0) return GUIDE_CONTEXT.missedDay;

  /* outstanding debt */
  if(S.punishment > 0) return GUIDE_CONTEXT.debt;

  /* review due — only when it genuinely is */
  if(reviewDue()) return GUIDE_CONTEXT.reviewDue;

  /* ------------------------------------------------------------------
     WHY / GOAL / DREAM — the player asked Jin-Woo to keep reminding him
     why he is doing this, what his goal is and what his dream is.

     Checked after the urgent context (streak, debt, review) but before
     the routine "half day" message, because the reminder is what makes
     the routine bearable. ~35% of refreshes land here.
     ------------------------------------------------------------------ */
  const guideRoll = Math.random();
  if(guideRoll < .12) return pickLine(WHY_LINES);
  if(guideRoll < .24) return pickLine(GOAL_LINES);
  if(guideRoll < .36) return pickLine(DREAM_LINES);

  /* AI Coach dynamic advice integration */
  if(typeof getCoachMessage === 'function' && Math.random() < 0.25){
    const coachLine = getCoachMessage();
    if(coachLine) return coachLine;
  }

  if(pct === 0) return GUIDE_CONTEXT.noMissions;
  if(pct >= .5 && pct < 1) return GUIDE_CONTEXT.halfDay;

  /* the situational checks below are occasional, not constant */
  if(S.streak >= 30 && streakMult() > 1.15 && Math.random() < .35) return GUIDE_CONTEXT.highStreak;

  const ri = rankIdx(S.xp), nxt = RANKS[ri+1];
  if(nxt && (nxt.xp - S.xp) < 500 && Math.random() < .4) return GUIDE_CONTEXT.rankNear;

  const near = BOSSES.find(b => {
    const st = S.boss[b.id] || [];
    const d = st.filter(Boolean).length;
    return d > 0 && d === b.steps.length - 1;
  });
  if(near && Math.random() < .3) return GUIDE_CONTEXT.bossNear;

  if(booksRead() === 0 && Math.random() < .2) return GUIDE_CONTEXT.bookWaiting;

  /* otherwise a random motivational line, avoiding an immediate repeat */
  const pool = GENERAL_PHRASES.length > 0 ? GENERAL_PHRASES : GUIDE_PHRASES;
  let line = pool[Math.floor(Math.random() * pool.length)];
  let guard = 0;
  while(line === lastLine && guard++ < 12){
    line = pool[Math.floor(Math.random() * pool.length)];
  }
  lastLine = line;
  return line;
}

/* pick a line that is not the one we showed last time */
function pickLine(arr){
  if(!arr || !arr.length) return '';
  let line = arr[Math.floor(Math.random() * arr.length)];
  let guard = 0;
  while(line === lastLine && guard++ < 12){
    line = arr[Math.floor(Math.random() * arr.length)];
  }
  lastLine = line;
  return line;
}

/* ---------------------------------------------------------------------
   COACH MESSAGES
   --------------------------------------------------------------------- */
function saveMsg(subject, body){
  S.msgs.unshift({s:subject, b:body, d:new Date().toLocaleString()});
  if(S.msgs.length > 30) S.msgs.pop();
  save();
}

/* ---------------------------------------------------------------------
   CLEAR THE DEBT — fresh start
   --------------------------------------------------------------------- */


/* ---------------------------------------------------------------------
   AUTO-BACKUP — quietly writes a rolling snapshot so a wiped browser
   never costs more than one day of progress.
   --------------------------------------------------------------------- */
function autoBackup(){
  const today = dayKey();
  if(S.lastAuto === today) return;
  S.lastAuto = today;
  try{
    /* keep the last 7 daily snapshots, oldest dropped first */
    const snap = {d:today, xp:S.xp, level:S.level, streak:S.streak,
      qDone:S.qDone, badges:S.badges.slice(), perfectDays:(S.perfectDays||[]).slice()};
    const hist = JSON.parse(localStorage.getItem('soloSnapshots') || '[]');
    hist.push(snap);
    while(hist.length > 7) hist.shift();
    localStorage.setItem('soloSnapshots', JSON.stringify(hist));
    /* and a full state copy under a second key */
    localStorage.setItem('soloAutoState', JSON.stringify(S));
  }catch(e){}
}

function autoBackupInfo(){
  try{
    const hist = JSON.parse(localStorage.getItem('soloSnapshots') || '[]');
    return hist;
  }catch(e){ return []; }
}

/* ---------------------------------------------------------------------
   WEEKLY REVIEW — five questions, every Sunday, saved forever
   --------------------------------------------------------------------- */
function saveReview(answers){
  if(!S.reviews) S.reviews = [];
  const wk = weekKey();
  const existing = S.reviews.findIndex(r => r.week === wk);
  const rec = {
    week: wk,
    when: new Date().toLocaleDateString(),
    level: S.level, xp: S.xp, streak: S.streak,
    missions: S.qDone,
    answers: answers
  };
  if(existing >= 0) S.reviews[existing] = rec;
  else S.reviews.unshift(rec);
  if(S.reviews.length > 60) S.reviews.pop();
  S.lastReview = dayKey();
  save();
  addXP(120, null, true, 'bonus');
  overlay('REVIEW LOGGED','+120 XP','A week that is reviewed is a week that improves.', false);
  log('REVIEW','Weekly review saved. <b>+120 XP</b>.');
  renderAll();
}

function reviewDue(){
  if(!S.started) return false;
  /* the review belongs to Sunday — do not nag on every other day */
  const isSunday = getCairoDayOfWeek() === 0;
  const doneThisWeek = S.lastReview && daysBetween(S.lastReview, dayKey()) < 7;
  if(doneThisWeek) return false;
  if(isSunday) return true;
  /* if a full week slipped past without a Sunday review, it is overdue */
  return S.lastReview ? daysBetween(S.lastReview, dayKey()) >= 14 : false;
}

/* ---------------------------------------------------------------------
   CONSISTENCY DATA — last 30 days, for the analytics panel
   --------------------------------------------------------------------- */
function last30(){
  const out = [];
  const today = dayKey();
  for(let i = 29; i >= 0; i--){
    const k = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(today, -i) : today;
    const rec = (S.dailyHistory && S.dailyHistory[k]) || null;
    if(i === 0 && typeof TaskEngine !== 'undefined' && TaskEngine.syncTodayHistory){
      const tRec = TaskEngine.syncTodayHistory();
      out.push({ day: k, done: tRec.missionsCompleted, total: tRec.missionsTotal, active: tRec.activeDay, future: false });
    } else if(rec){
      out.push({ day: k, done: rec.missionsCompleted || 0, total: rec.missionsTotal || 1, active: !!rec.activeDay, future: false });
    } else if(S.log30 && S.log30[k]){
      out.push({ day: k, done: S.log30[k].done || 0, total: S.log30[k].total || 1, active: (S.log30[k].done || 0) > 0, future: false });
    } else {
      out.push({ day: k, done: 0, total: 0, active: false, future: false });
    }
  }
  return out;
}

function snapshotToday(){
  if(typeof TaskEngine !== 'undefined' && TaskEngine.syncTodayHistory){
    TaskEngine.syncTodayHistory();
  }
}

function toggleRecoveryMode(){
  if(!S.foundationProfile) S.foundationProfile = {};
  const current = !!S.foundationProfile.recoveryMode;
  const next = !current;
  S.foundationProfile.recoveryMode = next;
  if(next){
    log('RECOVERY MODE ACTIVE', 'Workload dropped to 2-3 gentle momentum tasks (~35 min) to protect consistency.');
    if(typeof sfx === 'function') sfx('badge');
  } else {
    log('STANDARD MODE RESTORED', 'Full daily foundation allocations active.');
    if(typeof sfx === 'function') sfx('mission');
  }
  save();
  renderAll();
  return next;
}

/* Returns the active daily priorities list:
   - If Recovery Mode is active: returns 2-3 gentle tasks (~35 min) to protect streak
   - Days 1-14 Foundation Phase: strictly 3-5 tasks (target 4) matching ~220 min budget
   - Days 15+: 5-7 tasks upon verified consistency
   - Hard cap: Never exceeds 10 tasks
   - Strictly enforces Saudi Phone gating policy: Zero direct applications until phone is active */
function getDailyPriorities(){
  if(typeof TaskEngine !== 'undefined' && TaskEngine.getDailyMissions){
    return TaskEngine.getDailyMissions();
  }
  return [];
}

function updateLifeStatus(key, value){
  if(!S.lifeStatus) S.lifeStatus = {};
  S.lifeStatus[key] = value;

  if(key === 'currentDifficulty'){
    const levelNum = parseInt(value, 10) || 1;
    const names = { 1: 'Level 1 — Normal', 2: 'Level 2 — Developing', 3: 'Level 3 — Advanced', 4: 'Level 4 — Elite' };
    S.lifeStatus.currentDifficulty = levelNum;
    S.lifeStatus.difficultyName = names[levelNum] || 'Level 1 — Normal';
    log('DIFFICULTY UPDATED', 'Progression calibrated to <b>' + S.lifeStatus.difficultyName + '</b>');
  }

  if(key === 'saudiPhone'){
    const on = !!value;
    S.lifeStatus.saudiPhone = on;
    if(on){
      log('CONTACT VERIFIED', 'Saudi phone confirmed active. <b>Stage 3 Job Search unlocked!</b>');
      if(typeof ceremonyCard === 'function'){
        ceremonyCard({
          kicker: 'SYSTEM RECONFIGURATION',
          big: 'Saudi Contact Verified',
          sub: 'Local phone active. Direct job search gates and recruiter outreach quests are now unlocked.',
          stat: 'Stage 3: Professional Job Search Active',
          rare: true
        });
      }
    } else {
      log('GATE RE-APPLIED', 'Saudi phone marked inactive. Stage 3 direct job applications gated.');
    }
  }

  save();
  renderAll();
}

function submitLifeCheckin(rating, feedback, lifeUpdates){
  if(!S.lifeStatus) S.lifeStatus = {};
  if(!S.lifeStatus.checkinHistory) S.lifeStatus.checkinHistory = [];

  let difficultyAction = 'maintained';
  let curDiff = S.lifeStatus.currentDifficulty || 1;

  if(rating === 'too_hard'){
    if(curDiff > 1){
      curDiff--;
      S.lifeStatus.currentDifficulty = curDiff;
      const names = { 1: 'Level 1 — Normal', 2: 'Level 2 — Developing', 3: 'Level 3 — Advanced', 4: 'Level 4 — Elite' };
      S.lifeStatus.difficultyName = names[curDiff];
      difficultyAction = 'lowered to ' + S.lifeStatus.difficultyName;
      log('SYSTEM ADJUSTED', 'Pacing calibrated: ' + difficultyAction + ' to protect consistency.');
    } else {
      difficultyAction = 'Level 1 maintained (focusing on core 3-5 tasks)';
    }
  } else if(rating === 'too_easy'){
    if(curDiff < 4){
      curDiff++;
      S.lifeStatus.currentDifficulty = curDiff;
      const names = { 1: 'Level 1 — Normal', 2: 'Level 2 — Developing', 3: 'Level 3 — Advanced', 4: 'Level 4 — Elite' };
      S.lifeStatus.difficultyName = names[curDiff];
      difficultyAction = 'upgraded to ' + S.lifeStatus.difficultyName;
      log('LEVEL UPGRADE', 'Challenge increased: ' + difficultyAction + '!');
    } else {
      difficultyAction = 'Level 4 Elite maintained (maximum capacity)';
    }
  } else {
    difficultyAction = 'maintained at current level';
  }

  const checkinRecord = {
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
    rating: rating,
    feedback: feedback || '',
    lifeUpdates: lifeUpdates || '',
    resultingDifficulty: curDiff,
    action: difficultyAction
  };

  S.lifeStatus.checkinHistory.unshift(checkinRecord);
  if(S.lifeStatus.checkinHistory.length > 30) S.lifeStatus.checkinHistory.pop();

  addXP(20, null, true, 'checkin');
  log('CHECK-IN RECORDED', 'Reflection submitted: +20 XP. System calibrated.');

  save();
  renderAll();
  return checkinRecord;
}
function createCustomTask(title, sub, xp, duration, priority, project, action, why){
  if(!title) return false;
  const currentToday = getDailyPriorities();
  if(currentToday.length >= MAX_DAILY_TASKS){
    alert('Strict Rule: Maximum 10 active daily tasks allowed. Complete or reschedule an existing task first.');
    return false;
  }
  
  const newTask = {
    id: 'ct_' + Date.now(),
    name: title,
    sub: sub || 'Career & Goals',
    stat: 'career',
    xp: parseInt(xp, 10) || 15,
    duration: duration || '25 min',
    priority: priority || 'medium',
    project: project || null,
    why: why || 'User defined strategic action',
    action: action || title,
    criteria: 'Marked complete by user',
    outcome: 'Milestone progress achieved',
    status: 'today',
    createdAt: Date.now()
  };
  
  if(!S.customTasks) S.customTasks = [];
  S.customTasks.unshift(newTask);
  save();
  renderAll();
  log('TASK CREATED', 'New task added: <b>' + esc(title) + '</b>');
  return true;
}

/* Helper to locate any task object across all existing definitions and custom tasks */
function findTaskAnywhere(id){
  if(!id) return null;
  if(S.customTasks && S.customTasks.length){
    const ct = S.customTasks.find(t => t.id === id);
    if(ct) return ct;
  }
  if(typeof INTELLIGENT_QUESTS_POOL !== 'undefined'){
    const q = INTELLIGENT_QUESTS_POOL.find(t => t.id === id);
    if(q) return q;
  }
  if(typeof RECOVERY_TASKS_DEF !== 'undefined'){
    const r = RECOVERY_TASKS_DEF.find(t => t.id === id);
    if(r) return r;
  }
  if(typeof ACTIVE_DAILY_TASKS_DEF !== 'undefined'){
    const a = ACTIVE_DAILY_TASKS_DEF.find(t => t.id === id);
    if(a) return a;
  }
  if(typeof DAILY !== 'undefined'){
    const d = DAILY.find(t => t.id === id);
    if(d) return d;
  }
  if(typeof WEEKLY !== 'undefined'){
    const w = WEEKLY.find(t => t.id === id);
    if(w) return w;
  }
  return { id: id, name: 'Task ' + id, xp: 25, stat: 'career' };
}

function updateTaskStatus(taskId, newStatus){
  if(!taskId) return;
  if(!S.taskStatus) S.taskStatus = {};
  S.taskStatus[taskId] = newStatus;
  
  if(S.customTasks){
    const ct = S.customTasks.find(t => t.id === taskId);
    if(ct){
      ct.status = newStatus;
      if(newStatus === 'archived') ct.archived = true;
    }
  }

  // Synchronize dropdown completion with S.daily and XP
  const isCurrentlyDone = !!(S.daily && S.daily[taskId]);
  if(newStatus === 'completed' && !isCurrentlyDone){
    toggleLifeOSTask(taskId);
    return;
  } else if(newStatus !== 'completed' && isCurrentlyDone){
    toggleLifeOSTask(taskId);
    return;
  }

  save();
  renderAll();
}

function toggleLifeOSTask(taskId, ev){
  if(typeof TaskEngine !== 'undefined' && TaskEngine.toggleTask){
    return TaskEngine.toggleTask(taskId, ev);
  }
  return false;
}

function toggleHabitRoutine(habitId, ev){
  if(typeof HabitEngine !== 'undefined' && HabitEngine.toggleHabit){
    return HabitEngine.toggleHabit(habitId, ev);
  }
  return false;
}

function advanceProject(projectId, increment){
  if(!S.projects) S.projects = {};
  if(!S.projects[projectId]) S.projects[projectId] = { progress: 0, notes: [], customTasks: [] };
  const p = S.projects[projectId];
  p.progress = Math.min(100, (p.progress || 0) + (increment || 15));
  log('PROJECT ADVANCE', 'Project progress: <b>' + p.progress + '%</b>');
  if(p.progress === 100){
    addXP(100, 'career', true, 'project');
    overlay('PROJECT COMPLETED', projectId, 'Outstanding execution. Saudi roadmap milestone updated.', false);
  }
  save();
}

function toggleProjectSubtask(projectId, subtaskId){
  if(!S.projects) S.projects = {};
  if(!S.projects[projectId]) S.projects[projectId] = { progress: 0, subtasks: {} };
  if(!S.projects[projectId].subtasks) S.projects[projectId].subtasks = {};
  
  const current = !!S.projects[projectId].subtasks[subtaskId];
  S.projects[projectId].subtasks[subtaskId] = !current;
  
  if(!current){
    addXP(20, 'career', true, 'project');
    sfx('check');
    log('SUBTASK DONE', 'Project task completed (+20 XP).');
  } else {
    subXP(20, 'career', 'project', 20);
    sfx('uncheck');
  }
  save();
  renderAll();
}

function addProjectNote(projectId, noteText){
  if(!noteText) return;
  if(!S.projects) S.projects = {};
  if(!S.projects[projectId]) S.projects[projectId] = { progress: 0, notes: [] };
  if(!S.projects[projectId].notes) S.projects[projectId].notes = [];
  S.projects[projectId].notes.push({ text: noteText, date: dayKey() });
  save();
  renderAll();
  log('NOTE ADDED', 'Note attached to project.');
}

function saveKnowledgeNote(title, category, tags, content){
  if(!title || !content) return;
  if(!S.knowledgeNotes) S.knowledgeNotes = [];
  const note = {
    id: 'kn_' + Date.now(),
    title: title,
    category: category || 'General',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    content: content,
    date: dayKey()
  };
  S.knowledgeNotes.unshift(note);
  addXP(15, 'selfdev', true, 'knowledge');
  save();
  renderAll();
  log('KNOWLEDGE SAVED', 'Note saved to Knowledge Base: <b>' + esc(title) + '</b> (+15 XP).');
}

function deleteKnowledgeNote(noteId){
  if(!S.knowledgeNotes) return;
  S.knowledgeNotes = S.knowledgeNotes.filter(n => n.id !== noteId);
  save();
  renderAll();
}

function saveJournalReflection(wins, blockers, lessons){
  if(!S.journal) S.journal = {};
  const today = dayKey();
  S.journal[today] = {
    date: today,
    wins: wins || '',
    blockers: blockers || '',
    lessons: lessons || '',
    timestamp: Date.now()
  };
  addXP(15, 'selfdev', true, 'journal');
  save();
  renderAll();
  log('JOURNAL SAVED', 'Daily reflection recorded (+15 XP).');
}

function updateRelocationBuffer(amount){
  if(!S.relocationFund) S.relocationFund = { target: 120000, current: 0, currency: 'EGP' };
  S.relocationFund.current = Math.max(0, parseInt(amount, 10) || 0);
  save();
  renderAll();
  log('FINANCE SAVED', 'Saudi relocation runway: <b>' + S.relocationFund.current.toLocaleString() + ' EGP</b>.');
}
