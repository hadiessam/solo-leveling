/* =====================================================================
   SOLO LEVELING — CORE ENGINE
   State, XP, penalties, streak freeze, courses, storage.
   ===================================================================== */

const LEVEL_XP    = 400;   /* was 250 — levels should take real work */
const STAT_XP     = 150;   /* was 120 */
const TIER_LEVELS = {1:1, 2:5, 3:15};
const STAGE_LEVELS= {1:1, 2:10, 3:30};
const SAVE_KEY    = 'soloV6';

/* CLOUD SYNC — JSONBin.io (syncs progress across devices) */
const JSONBIN_ID   = '6ac48da3ac6210605a17e2dd';
const JSONBIN_KEY  = '$2a$10$jgpu4pY.Ko3o5V7S4noudO0kC9/.KL0macRsDFNx8CwMGuFO9bHKS';
const JSONBIN_URL  = 'https://api.jsonbin.io/v3/b/' + JSONBIN_ID;

/* streak multiplier: consistency pays, but it is capped */
const MULT_MAX    = 1.5;   /* +50% XP at a 100-day streak */
const MULT_SPAN   = 200;   /* days needed to reach the cap */

/* perfect-day bonus: clear every mission and get paid for it */
const PERFECT_BONUS = 150;

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
    ver:5,
    xp:0, level:1, streak:0, best:0,
    lastActive:'', lastDay:'', lastWeek:'',
    daily:{}, weekly:{}, boss:{},
    statXP:{}, rewards:[], msgs:[], courses:{},
    qDone:0, sDone:0,
    penCount:0, xpLost:0, penaltyDay:'',
    freezes:0, freezeUsed:[], punishment:0,
    started:false, startedOn:'',
    milestones:[], badges:[],
    lastBackup:'', lastAuto:'', perfectDays:[], perfectPending:'', missionXP:{},
    reviews:[], lastReview:'', log30:{},
    typing:{now:0, target:60, hist:[]},
    books:{},
    hp:100, maxHp:100,
    mana:50, maxMana:50,
    classId:'',
    shadowLevel:0, shadowXp:0,
    focusSessions:0, focusDate:'',
    vision:[],
    shadowChars:[],
    xpSource:{},
    vocab:{}, vocabTotal:0, vocabDays:0,
    eggs:{}, eggsTotal:0, eggDay:'', eggMissionsToday:0, eggMissionTotal:0,
    eggStreakMark:0, eggLevelMark:0,
    pomoRunning:false, pomoEndsAt:0, pomoMode:'work',
    hist:[],
    /* Prestige System */
    prestige:0, prestigeMult:1, prestigeBadges:[],
    /* Pause System */
    paused:false, pauseDate:'', pauseReason:'',
    /* Character Stats */
    str:0, int:0, agi:0, end:0, statPoints:0,
    /* Monthly Boss Challenge */
    monthlyBoss:{active:false, progress:0, target:0, reward:0, month:''},
    /* Equipment */
    equipment:{weapon:null, armor:null, accessory:null},
    /* AI Coach */
    coachMsg:'', coachDate:'',
    /* Habit Strength */
    habitStrength:{},
    /* Negative Habits */
    negativeHabits:{}, negHabitDamage:0
  };
}

let S = read();

function read(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw){
      /* migrate forward from any older version — progress is never lost */
      const old = localStorage.getItem('soloV5') || localStorage.getItem('soloV4') || localStorage.getItem('soloV3');
      if(old){
        const o = Object.assign(blank(), JSON.parse(old));
        o.ver = 6;
        o.freezes = 0;   /* freezes now start at zero — you earn them */
        o.freezeUsed = o.freezeUsed || [];
        o.punishment = 0;          /* clear any outstanding debt on upgrade */
        o.started = true;
        o.startedOn = o.startedOn || o.lastDay || '';
        if(!o.statXP) o.statXP = {};
        if(!o.courses) o.courses = {};
        if(!o.milestones) o.milestones = [];
        if(!o.badges) o.badges = [];
        if(!o.perfectDays) o.perfectDays = [];
        if(!o.perfectPending) o.perfectPending = '';
        if(!o.missionXP) o.missionXP = {};
        /* streak: if old save has 2, reset to 1 (user started yesterday) */
        if(o.streak >= 2) o.streak = 1;
        if(!o.reviews) o.reviews = [];
        if(!o.log30) o.log30 = {};
        if(!o.typing) o.typing = {now:0, target:60, hist:[]};
        if(!o.books) o.books = {};
        if(!o.hp) o.hp = 100;
        if(!o.maxHp) o.maxHp = 100;
        if(!o.mana) o.mana = 50;
        if(!o.maxMana) o.maxMana = 50;
        if(!o.classId) o.classId = '';
        if(!o.shadowLevel) o.shadowLevel = 0;
        if(!o.focusSessions) o.focusSessions = 0;
        if(!o.focusDate) o.focusDate = '';
        if(!o.vision) o.vision = [];
        if(!o.shadowChars) o.shadowChars = [];
        if(!o.shadowXp) o.shadowXp = 0;
        if(!o.shadowLevel) o.shadowLevel = 0;
        if(!o.xpSource) o.xpSource = {};
        if(!o.vocab) o.vocab = {};
        if(!o.vocabTotal) o.vocabTotal = 0;
        if(!o.vocabDays) o.vocabDays = 0;
        if(!o.eggs) o.eggs = {};
        if(!o.eggsTotal) o.eggsTotal = 0;
        if(!o.eggDay) o.eggDay = '';
        if(!o.eggMissionsToday) o.eggMissionsToday = 0;
        if(!o.eggMissionTotal) o.eggMissionTotal = 0;
        if(!o.eggStreakMark) o.eggStreakMark = 0;
        if(!o.eggLevelMark) o.eggLevelMark = 0;
        /* older saves stored a character 'level' — convert it to a star */
        o.shadowChars = (o.shadowChars || []).map(c => ({
          id:c.id,
          star: c.star || Math.min(MAX_STARS, c.level || 1),
          power: c.power || 35
        }));
        /* rename the old 'perfect' badge id to the new one */
        o.badges = o.badges.map(b => b === 'perfect' ? 'perfect1' : b);
        return o;
      }
      return blank();
    }
    const o = Object.assign(blank(), JSON.parse(raw));
    if(!o.statXP) o.statXP = {};
    if(!o.courses) o.courses = {};
    if(!o.freezeUsed) o.freezeUsed = [];
    if(!o.milestones) o.milestones = [];
    if(!o.badges) o.badges = [];
    if(!o.perfectDays) o.perfectDays = [];
    if(!o.reviews) o.reviews = [];
    if(!o.log30) o.log30 = {};
    if(!o.typing) o.typing = {now:0, target:60, hist:[]};
    if(!o.books) o.books = {};
    if(!o.hp) o.hp = 100;
    if(!o.maxHp) o.maxHp = 100;
    if(!o.mana) o.mana = 50;
    if(!o.maxMana) o.maxMana = 50;
    if(!o.classId) o.classId = '';
    if(!o.shadowLevel) o.shadowLevel = 0;
    if(!o.focusSessions) o.focusSessions = 0;
    if(!o.focusDate) o.focusDate = '';
    if(!o.vision) o.vision = [];
    if(!o.shadowChars) o.shadowChars = [];
    if(!o.shadowXp) o.shadowXp = 0;
    if(!o.shadowLevel) o.shadowLevel = 0;
    if(!o.xpSource) o.xpSource = {};
    if(!o.vocab) o.vocab = {};
    if(!o.vocabTotal) o.vocabTotal = 0;
    if(!o.vocabDays) o.vocabDays = 0;
    if(!o.eggs) o.eggs = {};
    if(!o.eggsTotal) o.eggsTotal = 0;
    if(!o.eggDay) o.eggDay = '';
    if(!o.eggMissionsToday) o.eggMissionsToday = 0;
    if(!o.eggMissionTotal) o.eggMissionTotal = 0;
    if(!o.eggStreakMark) o.eggStreakMark = 0;
    if(!o.eggLevelMark) o.eggLevelMark = 0;
    o.shadowChars = (o.shadowChars || []).map(c => ({
      id:c.id,
      star: c.star || Math.min(MAX_STARS, c.level || 1),
      power: c.power || 35
    }));
    o.badges = o.badges.map(b => b === 'perfect' ? 'perfect1' : b);
    return o;
  }catch(e){ return blank(); }
}

/* ---------------------------------------------------------------------
   CLASS SYSTEM — choose your path at level 10
   --------------------------------------------------------------------- */
function chooseClass(classId){
  if(S.level < 10){ sfx('error'); alert('Classes unlock at level 10.'); return; }
  if(S.classId){ sfx('error'); alert('You already chose a class.'); return; }
  const c = CLASSES.find(x => x.id === classId);
  if(!c){ sfx('error'); return; }
  S.classId = classId;
  save();
  sfx('badge');
  overlay('CLASS CHOSEN', ic(c.icon,50) + '  ' + c.name, c.passive, false);
  log('CLASS', 'You chose the <b>' + c.name + '</b> path. ' + c.passive);
  renderAll();
}

/* ---------------------------------------------------------------------
   SHADOW — grows automatically as you complete missions
   --------------------------------------------------------------------- */
function growShadow(){
  S.shadowXp = (S.shadowXp || 0) + 1;
  /* one shadow level every 8 missions */
  const lvl = Math.floor(S.shadowXp / 8);
  if(lvl > (S.shadowLevel || 0)){
    const was = S.shadowLevel || 0;
    S.shadowLevel = lvl;
    /* announce only when the stage itself changes */
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

/* ---------------------------------------------------------------------
   LOOT — random drops from real missions, not a button
   --------------------------------------------------------------------- */
function maybeDropLoot(){
  /* 18% chance per mission — rare enough to feel good */
  if(Math.random() > 0.18) return;
  const roll = Math.random() * 100;
  let cumulative = 0;
  for(const item of LOOT){
    cumulative += item.chance * 100;
    if(roll <= cumulative){
      if(item.hp) healHP(item.hp);
      if(item.mana) restoreMana(item.mana);
      if(item.xp) addXP(item.xp, null, true, 'bonus');
      sfx(item.id === 'gem' || item.id === 'chest' ? 'gem' : 'loot');
      const bonus = item.xp ? '+' + item.xp + ' XP'
                  : item.hp ? '+' + item.hp + ' HP'
                  : '+' + item.mana + ' mana';
      setTimeout(()=>{
        overlay('LOOT FOUND', ic(item.icon,50) + '  ' + item.name, bonus, false);
        log('LOOT','Found <b>'+item.name+'</b> — '+bonus+'.');
      }, 700);
      return item;
    }
  }
  return null;
}

/* ---------------------------------------------------------------------
   MANA — regenerates on each completed mission
   --------------------------------------------------------------------- */
function regenMana(n){
  const before = S.mana;
  S.mana = Math.min(S.maxMana, S.mana + (n || 3));
  return S.mana - before;
}

/* ---------------------------------------------------------------------
   CLASS ABILITY — actually does something
   --------------------------------------------------------------------- */
function useAbility(){
  const c = CLASSES.find(x => x.id === S.classId);
  if(!c){ sfx('error'); alert('Choose a class first.'); return; }
  if(S.mana < c.ability.cost){ sfx('error'); alert('Not enough mana. You need ' + c.ability.cost + ' mana. Complete missions to regenerate it.'); return; }

  S.mana -= c.ability.cost;
  let result = '';

  switch(c.id){
    case 'mage':
      addXP(50, null, true, 'bonus');
      result = '+50 XP granted immediately.';
      break;
    case 'healer':
      healHP(20);
      S.shieldNext = true;
      result = '+20 HP restored. Your next penalty is halved.';
      break;
    case 'warrior':
      S.smashNext = true;
      result = 'Your next boss step awards double XP.';
      break;
    case 'rogue':
      const got = maybeDropLoot();
      result = got ? 'Found ' + got.name + '!' : 'No loot this time — try again after more missions.';
      break;
    default:
      result = 'Ability used.';
  }

  sfx('badge');
  overlay('ABILITY USED', ic(c.icon,50) + '  ' + c.ability.name, result, false);
  log('ABILITY','Used <b>'+c.ability.name+'</b>. '+result);
  save();
  renderAll();
}

/* ---------------------------------------------------------------------
   HP & MANA — health and mana system
   --------------------------------------------------------------------- */
function damageHP(n, silent){
  const c = CLASSES.find(x => x.id === S.classId);
  if(c && c.id === 'healer') n = Math.round(n * 0.8);
  /* a healer shield halves the next penalty */
  if(S.shieldNext){ n = Math.round(n / 2); S.shieldNext = false; }
  if(n <= 0) return 0;

  S.hp = Math.max(0, S.hp - n);
  if(S.hp === 0){
    S.hp = Math.round(S.maxHp * 0.5);
    sfx('damage');
    overlay('KNOCKED OUT', ic('heart',50) + '  HP 0', 'You pushed too hard. Rest and come back tomorrow.', true);
    log('DAMAGE', 'You were knocked out. HP restored to 50%.');
  } else if(!silent){
    sfx('damage');
    log('DAMAGE', 'Lost <b>' + n + ' HP</b>. ' + S.hp + ' / ' + S.maxHp + ' remaining.', true);
  }
  save();
  return n;
}

function healHP(n){
  S.hp = Math.min(S.maxHp, S.hp + n);
  save();
}

function restoreMana(n){
  S.mana = Math.min(S.maxMana, S.mana + n);
  save();
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
  drawFocus();
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
          return '<div class="erCard' + (RARITY_ORDER[c.rarity] >= 4 ? ' big' : '') + '" style="border-color:' + col + '">'
            + '<img src="' + c.img + '" alt="">'
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

/* ---------------------------------------------------------------------
   VOCABULARY — 5 words a day, tracked
   --------------------------------------------------------------------- */
function learnVocab(key){
  if(!S.vocab) S.vocab = {};
  const words = todaysVocab();
  const word = words.find(w => vocabKey(w.w) === key);
  if(!word) return;

  if(S.vocab[key]){
    delete S.vocab[key];
    subXP(8, 'selfdev', 'vocab');
    sfx('uncheck');
  } else {
    S.vocab[key] = dayKey();
    S.vocabTotal = (S.vocabTotal || 0) + 1;
    addXP(8, 'selfdev', false, 'vocab');
    sfx('vocab');
  }
  save();
  renderAll();
}

function vocabLearnedToday(){
  if(!S.vocab) return 0;
  const words = todaysVocab();
  return words.filter(w => S.vocab[vocabKey(w.w)]).length;
}

/* mark all of today's words as learned in one tap */
function learnAllVocab(){
  const words = todaysVocab();
  let n = 0;
  words.forEach(w => {
    const k = vocabKey(w.w);
    if(!S.vocab[k]){
      S.vocab[k] = dayKey();
      S.vocabTotal = (S.vocabTotal || 0) + 1;
      addXP(8, 'selfdev', false, 'vocab');
      n++;
    }
  });
  if(n){
    sfx('vocab');
    overlay('WORDS LEARNED', n + ' WORDS', 'Today\u2019s vocabulary is done. +' + (n * 8) + ' XP.', false);
    log('VOCAB', 'Learned <b>' + n + '</b> new words. +' + (n * 8) + ' XP.');
  }
  save();
  renderAll();
}

function save(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){}
  cloudSave();   /* sync to cloud in the background */
}

/* ---------------------------------------------------------------------
   ADD XP MANUALLY — let the player add XP directly when the system
   misses something. Simple, transparent, no hidden math.
   --------------------------------------------------------------------- */
function addXPManual(){
  const input = document.getElementById('xpInput');
  if(!input) return;
  const val = parseInt(input.value, 10);
  if(isNaN(val) || val <= 0){
    alert('Please enter a positive XP amount.');
    return;
  }
  const oldXP = S.xp;
  S.xp += val;
  S.level = Math.floor(S.xp / LEVEL_XP) + 1;
  S.xpSource = S.xpSource || {};
  S.xpSource.manual = (S.xpSource.manual || 0) + val;
  save();
  const diff = S.xp - oldXP;
  log('XP ADDED', 'Manually added <b>'+val+' XP</b>. Total: <b>'+S.xp+' XP</b> (Level '+S.level+').');
  sfx('badge');
  overlay('XP ADDED', '+' + val + ' XP', 'Total: ' + S.xp + ' XP · Level ' + S.level, false);
  renderAll();
  input.value = '';
}

/* ---------------------------------------------------------------------
   CLOUD SYNC — push/pull progress to JSONBin.io so all devices share
   the same save. LocalStorage stays as the fast local cache.
   --------------------------------------------------------------------- */
function cloudSave(){
  if(typeof fetch === 'undefined') return;
  try{
    fetch(JSONBIN_URL, {
      method:'PUT',
      headers:{'Content-Type':'application/json','X-Master-Key':JSONBIN_KEY},
      body: JSON.stringify(S)
    }).catch(()=>{});
  }catch(e){}
}

function cloudLoad(){
  if(typeof fetch === 'undefined') return Promise.resolve(false);
  return fetch(JSONBIN_URL + '/latest', {
    headers:{'X-Master-Key':JSONBIN_KEY}
  }).then(r=>r.json()).then(j=>{
    if(j && j.record && j.record.xp !== undefined){
      const cloud = j.record;
      /* cloud wins if it has more XP (prevents stale overwrites) */
      if(cloud.xp >= S.xp){
        S = Object.assign(blank(), cloud);
        S.ver = 6;
        try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){}
        return true;
      }
    }
    return false;
  }).catch(()=>false);
}

/* ---------------------------------------------------------------------
   DATE HELPERS
   --------------------------------------------------------------------- */
const dayKey = () => new Date().toISOString().slice(0,10);
function weekKey(){
  /* Week starts on FRIDAY — weekly missions reset every Friday */
  const d = new Date();
  const off = (d.getDay() + 2) % 7; // Friday=0, Saturday=1, Sunday=2, Monday=3...
  const m = new Date(d); m.setDate(d.getDate()-off);
  /* use local date, not UTC, to avoid timezone drift */
  const y = m.getFullYear();
  const mo = String(m.getMonth()+1).padStart(2,'0');
  const da = String(m.getDate()).padStart(2,'0');
  return y + '-' + mo + '-' + da;
}
function daysBetween(a,b){
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/* ---------------------------------------------------------------------
   THE SYSTEM ONLY JUDGES YOU ONCE YOU HAVE STARTED.
   Before the first mission is ever completed, no penalty applies.
   --------------------------------------------------------------------- */
function resets(){
  const t = dayKey(), w = weekKey();

  if(S.lastDay !== t){
    /* judge the day that just ended — but ONLY if the player was active */
    if(S.started && S.lastDay && S.penaltyDay !== S.lastDay){
      judgeDay(S.lastDay);
    }
    S.lastDay = t;
    S.daily = {};
  }
  if(S.lastWeek !== w){ S.lastWeek = w; S.weekly = {}; }
  save();
}

function judgeDay(day){
  if(!S.started) return;

  const avail  = available(DAILY);
  const done   = avail.filter(m => S.daily[m.id]).length;
  const missed = avail.length - done;

  /* streak freeze: nothing done but a freeze is held */
  if(done === 0 && S.freezes > 0 && S.streak > 0){
    S.freezes--;
    S.freezeUsed.push(day);
    S.punishment += FREEZE.punishmentXP;
    damageHP(15);
    log('FREEZE USED',
      'Streak saved. You now owe <b>'+FREEZE.punishmentXP+' XP</b> in missions before the debt clears.', true);
    S.penaltyDay = day;
    save();
    return;
  }

  /* Penalties are proportional, not fixed counts — otherwise a 21-mission day
     punishes someone who did 18 of them. What matters is the share you cleared. */
  const pctDone = avail.length ? done / avail.length : 1;

  let cost = 0, note = '', hpLoss = 0;
  if(done === 0 && avail.length > 0){
    cost = 60; note = 'Zero missions completed. Full failure.'; hpLoss = 30;
  } else if(pctDone < 0.4){
    cost = 35; note = 'Only ' + done + ' of ' + avail.length + ' missions cleared.'; hpLoss = 15;
  } else if(pctDone < 0.7){
    cost = 15; note = done + ' of ' + avail.length + ' missions cleared.'; hpLoss = 6;
  }
  /* 70% or better is a passing day — no penalty, and it heals you */

  /* a clean day heals you instead of hurting you */
  if(hpLoss === 0 && done > 0){
    healHP(10);
    if(done === avail.length && avail.length > 0){
      healHP(10);
      log('HEAL','Full day cleared. <b>+20 HP</b> restored.');
    }
  }

  if(hpLoss > 0) damageHP(hpLoss, true);

  if(cost > 0){
    /* an outstanding freeze debt is paid down first */
    if(S.punishment > 0){
      const pay = Math.min(S.punishment, cost);
      S.punishment -= pay;
      cost -= pay;
      if(pay > 0) log('DEBT','Freeze debt reduced by <b>'+pay+' XP</b>. '+S.punishment+' remaining.', true);
    }
    if(cost > 0){
      S.xp = Math.max(0, S.xp - cost);
      S.level = Math.floor(S.xp/LEVEL_XP) + 1;
      S.penCount++;
      S.xpLost += cost;
      log('PENALTY', note + ' <b>-' + cost + ' XP</b>.', true);
    }
  }
  S.penaltyDay = day;
}

/* ---------------------------------------------------------------------
   STREAK MULTIPLIER — consistency pays
   --------------------------------------------------------------------- */
function streakMult(){
  const m = 1 + Math.min(MULT_MAX - 1, (S.streak / MULT_SPAN) * (MULT_MAX - 1));
  return Math.round(m * 100) / 100;
}
function applyMult(base){
  return Math.round(base * streakMult());
}

/* ---------------------------------------------------------------------
   XP
   --------------------------------------------------------------------- */
function addXP(n, statKey, raw, source){
  const lv0 = S.level, rk0 = rankIdx(S.xp);

  /* outstanding freeze debt is paid down first */
  if(S.punishment > 0 && n > 0){
    const pay = Math.min(S.punishment, n);
    S.punishment -= pay;
    log('DEBT','Freeze debt reduced by <b>'+pay+' XP</b>. '+S.punishment+' remaining.');
  }

  /* streak multiplier applies to mission XP, not to bonuses */
  let gain = raw ? n : applyMult(n);

  /* class passives — these are real now */
  const cls = CLASSES.find(c => c.id === S.classId);
  if(cls && gain > 0){
    if(cls.id === 'mage' && !raw) gain = Math.round(gain * 1.10);
    if(cls.id === 'warrior' && raw && S.bossXp) gain = Math.round(gain * 1.10);
    if(cls.id === 'rogue' && !raw && Math.random() < 0.25){
      gain = Math.round(gain * 1.5);
      log('ROGUE','Critical strike! <b>+50% XP</b> on that mission.');
    }
  }

  S.xp += gain;
  /* remember where it came from, so the breakdown is real */
  if(!S.xpSource) S.xpSource = {};
  if(gain > 0 && source) S.xpSource[source] = (S.xpSource[source] || 0) + gain;

  if(statKey) S.statXP[statKey] = (S.statXP[statKey]||0) + gain;
  S.level = Math.floor(S.xp/LEVEL_XP) + 1;

  const rk1 = rankIdx(S.xp);

  if(rk1 > rk0){
    rankCeremony(rk0, rk1);
  } else if(S.level > lv0){
    levelCeremony(lv0, S.level);
  } else {
    sfx('success');
  }

  checkUnlocks(lv0);
  checkBadges();

  if(S.streak > 0 && S.streak % FREEZE.earnEvery === 0 && S.freezes < FREEZE.max){
    S.freezes++;
    setTimeout(()=>log('FREEZE EARNED','You earned a streak freeze. You hold <b>'+S.freezes+'</b>.'), 900);
  }
  save();
  return gain;
}

/* ---------------------------------------------------------------------
   PERFECT DAY — clear everything and get paid for it
   --------------------------------------------------------------------- */
function checkPerfectDay(){
  const av = available(DAILY);
  if(!av.length) return;
  const all = av.every(m => S.daily[m.id]);
  if(!all) return;

  const today = dayKey();
  if(S.perfectDays && S.perfectDays.includes(today)) return;
  if(!S.perfectDays) S.perfectDays = [];
  S.perfectDays.push(today);

  /* mark the bonus as pending so an uncheck can cancel it before it lands */
  S.perfectPending = today;
  save();

  setTimeout(()=>{
    /* the player may have unchecked a mission before this fired */
    if(S.perfectPending !== today) return;
    const stillAll = available(DAILY).every(m => S.daily[m.id]);
    if(!stillAll){
      S.perfectPending = '';
      const i = S.perfectDays.indexOf(today);
      if(i >= 0) S.perfectDays.splice(i, 1);
      save();
      return;
    }
    S.perfectPending = '';
    ceremonyCard({
      kicker:'PERFECT DAY',
      big:'ALL MISSIONS CLEARED',
      sub:'Every single mission completed today.',
      stat:'Bonus: <b>+'+PERFECT_BONUS+' XP</b> &middot; ' + S.perfectDays.length + ' perfect day(s) all time.',
      rare:true
    });
    addXP(PERFECT_BONUS, null, true, 'bonus');
    log('PERFECT DAY','Every mission cleared. <b>+'+PERFECT_BONUS+' XP</b> bonus.');
    save();
  }, 1200);
}

/* if a mission is unchecked after a perfect day was banked, take the bonus back */
function unbankPerfectDay(){
  const today = dayKey();
  /* cancel a bonus that has not landed yet */
  if(S.perfectPending === today) S.perfectPending = '';
  if(!S.perfectDays || !S.perfectDays.includes(today)) return false;
  const i = S.perfectDays.indexOf(today);
  S.perfectDays.splice(i, 1);
  subXP(PERFECT_BONUS, null, 'bonus');
  log('PERFECT DAY LOST','A mission was unchecked — the Perfect Day bonus was removed.', true);
  return true;
}

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

function subXP(n, statKey, source, actualGain){
  /* Pass the EXACT amount that was added (after streak mult + class passives),
     so unchecking a mission never leaks or over-charges XP. */
  const amount = actualGain != null ? actualGain : n;
  S.xp = Math.max(0, S.xp - amount);
  if(statKey) S.statXP[statKey] = Math.max(0, (S.statXP[statKey]||0) - amount);
  /* the source ledger must shrink too, or the breakdown stops adding up */
  if(source && S.xpSource && S.xpSource[source]){
    S.xpSource[source] = Math.max(0, S.xpSource[source] - amount);
  }
  S.level = Math.floor(S.xp/LEVEL_XP) + 1;
  save();
}

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
  const t = dayKey();
  if(S.lastActive !== t){
    const gap = S.lastActive ? daysBetween(S.lastActive, t) : 1;
    if(gap === 2 && S.freezes > 0){
      S.freezes--;
      S.freezeUsed.push(S.lastActive);
      S.punishment += FREEZE.punishmentXP;
      log('FREEZE USED','Missed one day — freeze spent. Streak preserved. Debt: <b>'+S.punishment+' XP</b>.', true);
    } else if(gap > 1){
      S.streak = 0;
    }
    S.lastActive = t;
    /* first day ever: streak becomes 1, not 2 */
    if(!S.started || S.streak === 0) S.streak = 1;
    else S.streak++;
    if(S.streak > S.best) S.best = S.streak;
    log('SYSTEM','Streak: <b>'+S.streak+' day'+(S.streak>1?'s':'')+'</b>.');
  }
}

function buyFreeze(){
  if(S.freezes >= FREEZE.max){ alert('You already hold the maximum of '+FREEZE.max+' freezes.'); return; }
  if(S.xp < FREEZE.costXP){ alert('Not enough XP. A freeze costs '+FREEZE.costXP+' XP.'); return; }
  if(!confirm('Spend '+FREEZE.costXP+' XP on a streak freeze?')) return;
  S.xp -= FREEZE.costXP;
  S.level = Math.floor(S.xp/LEVEL_XP) + 1;
  S.freezes++;
  save();
  log('FREEZE','Purchased a streak freeze. You hold <b>'+S.freezes+'</b>.');
  renderAll();
}

/* ---------------------------------------------------------------------
   MISSIONS
   --------------------------------------------------------------------- */
function available(list){
  return list.filter(m => !m.unlock || S.level >= m.unlock.level);
}
function lockedOf(list){
  return list.filter(m => m.unlock && S.level < m.unlock.level);
}

function toggleMission(kind, id, ev){
  const list = kind === 'daily' ? DAILY : WEEKLY;
  const m = list.find(x => x.id === id);
  if(!m) return;
  if(m.unlock && S.level < m.unlock.level) return;

  const store = kind === 'daily' ? S.daily : S.weekly;

  if(store[id]){
    delete store[id];
    const actualGain = (S.missionXP && S.missionXP[id]) || m.xp;
    subXP(m.xp, m.stat, 'mission', actualGain);
    if(S.missionXP) delete S.missionXP[id];
    unbankPerfectDay();
    S.qDone = Math.max(0, S.qDone - 1);
    sfx('uncheck');
  } else {
    /* the first ever completion starts the System */
    if(!S.started){
      S.started = true;
      S.startedOn = dayKey();
      S.streak = 1;
      S.best = Math.max(S.best, 1);
      S.lastActive = dayKey();
      sfx('boot');
      log('SYSTEM','You have started. Day 1 logged.');
    }
    store[id] = true;
    S.qDone++;
    markActive();
    const xpBefore = S.xp;
    addXP(m.xp, m.stat, false, 'mission');
    S.missionXP = S.missionXP || {};
    S.missionXP[id] = S.xp - xpBefore;
    sfx('mission');
    if(ev) floatXP(ev.clientX, ev.clientY, m.xp, false);
    growShadow();
    regenMana(3);
    maybeDropLoot();
    checkPerfectDay();
    checkEggDrops();
  }
  snapshotToday();
  save();
  renderAll();
}



/* ---------------------------------------------------------------------
   BOSS RAID STEPS
   --------------------------------------------------------------------- */
function toggleStep(bossId, i){
  const b = BOSSES.find(x => x.id === bossId);
  if(!b) return;
  if(!S.boss[bossId]) S.boss[bossId] = b.steps.map(()=>false);

  const on = !S.boss[bossId][i];
  S.boss[bossId][i] = on;

  if(on){
    S.sDone++;
    S.bossXp = true;
    addXP(b.xp, null, true, 'boss');
    S.bossXp = false;
    log('RAID','<b>'+b.name+'</b> &mdash; '+b.steps[i] + ' <b>+'+b.xp+' XP</b>');
    if(bossDone(bossId)){
      /* clearing a whole raid is a big moment and pays a big bonus */
      const bonus = b.reward || 0;
      setTimeout(()=>{
        ceremonyCard({
          kicker:'BOSS CLEARED',
          big:b.name,
          sub:'Every step completed. The raid is finished.',
          stat: bonus ? 'Completion bonus: <b>+'+bonus.toLocaleString()+' XP</b>' : 'The raid is complete.',
          rare:true
        });
        if(bonus) addXP(bonus, null, true, 'boss');
        log('BOSS CLEARED','<b>'+b.name+'</b> has fallen.' + (bonus ? ' <b>+'+bonus.toLocaleString()+' XP</b> bonus.' : ''));
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
  let line = GUIDE_PHRASES[Math.floor(Math.random() * GUIDE_PHRASES.length)];
  let guard = 0;
  while(line === lastLine && guard++ < 12){
    line = GUIDE_PHRASES[Math.floor(Math.random() * GUIDE_PHRASES.length)];
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
function clearDebt(){
  const owed = S.punishment;
  if(owed <= 0 && S.xpLost === 0){ alert('Nothing to clear. You are clean.'); return; }
  if(!confirm('Clear ' + owed + ' XP of freeze debt and reset the penalty record?')) return;
  S.punishment = 0;
  S.xpLost = 0;
  S.penCount = 0;
  save();
  overlay('DEBT CLEARED','0 XP','A clean slate. What happened before does not count against you.', false);
  log('SYSTEM','Debt cleared. The slate is clean \u2014 go and earn it.');
  renderAll();
}

/* ---------------------------------------------------------------------
   BACKUP & RESTORE — the safety net for your progress
   --------------------------------------------------------------------- */
function exportProgress(){
  const data = {
    app:'solo-leveling', ver:S.ver, exported:new Date().toISOString(),
    summary:{ level:S.level, xp:S.xp, rank:RANKS[rankIdx(S.xp)].name, streak:S.streak, badges:S.badges.length },
    state:S
  };
  const name = 'solo-leveling-backup-' + dayKey() + '.json';
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1500);

  S.lastBackup = dayKey();
  save();
  log('BACKUP','Progress exported to <b>'+name+'</b>. Keep it somewhere safe.');
  renderAll();
}

function importProgress(file){
  if(!file) return;
  const r = new FileReader();
  r.onload = () => {
    let parsed;
    try{ parsed = JSON.parse(r.result); }
    catch(e){ alert('That file is not a valid backup.'); return; }

    const state = parsed && parsed.state ? parsed.state : parsed;
    if(!state || typeof state.xp !== 'number'){ alert('That file does not look like a SOLO LEVELING backup.'); return; }

    const s = parsed.summary || {};
    const msg = 'Restore this backup?\n\n'
      + 'Level ' + (s.level != null ? s.level : state.level)
      + '  \u00b7  ' + (s.xp != null ? s.xp : state.xp) + ' XP'
      + (s.rank ? '  \u00b7  ' + s.rank : '')
      + (s.streak != null ? '\nStreak: ' + s.streak + ' days' : '')
      + (parsed.exported ? '\nExported: ' + new Date(parsed.exported).toLocaleString() : '')
      + '\n\nThis REPLACES your current progress.';

    if(!confirm(msg)) return;

    S = Object.assign(blank(), state);
    if(!S.statXP) S.statXP = {};
    if(!S.courses) S.courses = {};
    if(!S.freezeUsed) S.freezeUsed = [];
    if(!S.milestones) S.milestones = [];
    if(!S.badges) S.badges = [];
    save();
    renderAll();
    showPhrase();
    overlay('RESTORED','BACKUP LOADED','Your progress has been recovered.', false);
    log('RESTORE','Progress restored from backup.');
  };
  r.readAsText(file);
}

function backupStatus(){
  if(!S.lastBackup) return {text:'never', warn:true};
  const d = daysBetween(S.lastBackup, dayKey());
  if(d === 0) return {text:'today', warn:false};
  if(d === 1) return {text:'yesterday', warn:false};
  if(d < 7)   return {text:d + ' days ago', warn:false};
  return {text:d + ' days ago', warn:true};
}

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

/* recover the auto-saved state if the main save is ever lost */
function recoverAutoBackup(){
  let raw = null;
  try{ raw = localStorage.getItem('soloAutoState'); }catch(e){}
  if(!raw){ sfx('error'); alert('No automatic backup was found on this device.'); return; }
  if(!confirm('Restore the last automatic backup? This replaces your current progress.')) return;
  try{
    const o = Object.assign(blank(), JSON.parse(raw));
    S = o;
    save(); renderAll();
    overlay('RECOVERED','AUTO BACKUP','Your progress has been restored from the daily snapshot.', false);
    log('RESTORE','Recovered from the automatic backup.');
  }catch(e){ alert('That backup could not be read.'); }
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
  const isSunday = new Date().getDay() === 0;
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
  for(let i = 29; i >= 0; i--){
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0,10);
    const isToday = (i === 0);
    let done = 0, total = 0;

    if(isToday){
      const av = available(DAILY);
      total = av.length;
      done = av.filter(m => S.daily[m.id]).length;
    } else if(S.log30 && S.log30[k]){
      done = S.log30[k].done;
      total = S.log30[k].total;
    } else if(S.perfectDays && S.perfectDays.includes(k)){
      /* a recorded perfect day is a full day */
      total = 1; done = 1;
    } else if(S.started && S.startedOn && k >= S.startedOn){
      /* the day passed and we have no record — it was a miss */
      total = 1; done = 0;
    }
    out.push({day:k, done:done, total:total, active:done > 0, future:false});
  }
  return out;
}

/* ---------------------------------------------------------------------
   DAILY SNAPSHOT — record today's progress so history exists tomorrow
   --------------------------------------------------------------------- */
function snapshotToday(){
  if(!S.log30) S.log30 = {};
  const av = available(DAILY);
  S.log30[dayKey()] = {
    done: av.filter(m => S.daily[m.id]).length,
    total: av.length,
    xp: S.xp,
    level: S.level
  };
  save();
}


