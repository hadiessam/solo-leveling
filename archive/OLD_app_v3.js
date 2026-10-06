/* =====================================================================
   SOLO LEVELING — CORE ENGINE
   State, XP, penalties, tiers, streaks, storage.
   ===================================================================== */

const LEVEL_XP  = 250;   /* XP needed per level           */
const STAT_XP   = 120;   /* XP per stat level             */
const TIER_LEVELS = {1:1, 2:5, 3:15};

/* ---------------------------------------------------------------------
   STATE
   --------------------------------------------------------------------- */
function blank(){
  return {
    xp:0, level:1, streak:0, best:0,
    lastActive:'', lastDay:'', lastWeek:'',
    daily:{}, weekly:{}, boss:{},
    statXP:{}, claimed:{}, rewards:[], msgs:[],
    qDone:0, sDone:0, penCount:0, xpLost:0,
    penaltyDay:'', hist:[]
  };
}
let S = read();

function read(){
  try{
    const raw = localStorage.getItem('soloV3');
    if(!raw) return blank();
    const o = Object.assign(blank(), JSON.parse(raw));
    if(!o.statXP) o.statXP = {};
    return o;
  }catch(e){ return blank(); }
}
function save(){ try{ localStorage.setItem('soloV3', JSON.stringify(S)); }catch(e){} }

/* ---------------------------------------------------------------------
   DATE HELPERS
   --------------------------------------------------------------------- */
const dayKey = () => new Date().toISOString().slice(0,10);
function weekKey(){
  const d = new Date();
  const off = (d.getDay()+6)%7;               /* Monday = 0 */
  const m = new Date(d); m.setDate(d.getDate()-off);
  return m.toISOString().slice(0,10);
}

/* ---------------------------------------------------------------------
   RESETS — daily and weekly
   --------------------------------------------------------------------- */
function resets(){
  const t = dayKey(), w = weekKey();

  if(S.lastDay !== t){
    /* roll the streak before clearing */
    const y = new Date(); y.setDate(y.getDate()-1);
    const yk = y.toISOString().slice(0,10);
    if(S.lastActive && S.lastActive !== yk && S.lastActive !== t){
      S.streak = 0;
    }
    /* judge yesterday's daily quest */
    if(S.lastDay && S.penaltyDay !== S.lastDay){
      judgeDay(S.lastDay);
    }
    S.lastDay = t;
    S.daily = {};
  }
  if(S.lastWeek !== w){ S.lastWeek = w; S.weekly = {}; }
  save();
}

/* count how many missions were available and how many were done */
function judgeDay(day){
  const avail = DAILY.filter(m => !m.unlock || S.level >= m.unlock.level);
  const done  = avail.filter(m => S.daily[m.id]).length;
  const missed = avail.length - done;

  let cost = 0, note = '';
  if(done === 0 && avail.length > 0){
    cost = 60; note = 'Zero missions completed. Full failure.';
  } else if(missed >= 5){
    cost = 40; note = missed + ' missions missed.';
  } else if(missed >= 3){
    cost = 20; note = missed + ' missions missed.';
  }

  if(cost > 0){
    S.xp = Math.max(0, S.xp - cost);
    S.level = Math.floor(S.xp/LEVEL_XP) + 1;
    S.penCount++;
    S.xpLost += cost;
    log('PENALTY', note + ' <b>-' + cost + ' XP</b>.', true);
  }
  S.penaltyDay = day;
}

/* ---------------------------------------------------------------------
   XP
   --------------------------------------------------------------------- */
function addXP(n, statKey){
  const lv0 = S.level, rk0 = rankIdx(S.xp);

  S.xp += n;
  if(statKey) S.statXP[statKey] = (S.statXP[statKey]||0) + n;
  S.level = Math.floor(S.xp/LEVEL_XP) + 1;

  const rk1 = rankIdx(S.xp);

  if(rk1 > rk0){
    setTimeout(()=>overlay('RANK UP', RANKS[rk1].name, RANKS[rk1].note, false), 500);
    log('RANK UP','Promoted to <b>'+RANKS[rk1].name+'</b>.');
  } else if(S.level > lv0){
    setTimeout(()=>overlay('SYSTEM','LEVEL '+S.level,'Your strength has increased.', false), 500);
    log('LEVEL UP','Reached <b>level '+S.level+'</b>.');
  } else {
    beep(880,.07,'triangle');
  }
  checkTierUnlock(lv0);
  save();
}

function subXP(n, statKey){
  S.xp = Math.max(0, S.xp - n);
  if(statKey) S.statXP[statKey] = Math.max(0, (S.statXP[statKey]||0) - n);
  S.level = Math.floor(S.xp/LEVEL_XP) + 1;
  save();
}

function checkTierUnlock(oldLevel){
  for(const t in TIER_LEVELS){
    const need = TIER_LEVELS[t];
    if(oldLevel < need && S.level >= need){
      setTimeout(()=>overlay('NEW MISSIONS UNLOCKED','TIER '+t, GUIDE_BY_TIER[t], false), 1400);
      log('UNLOCK','Tier '+t+' missions are now available.');
    }
  }
}

function rankIdx(xp){
  let i = 0;
  for(let k=0;k<RANKS.length;k++) if(xp >= RANKS[k].xp) i = k;
  return i;
}

/* ---------------------------------------------------------------------
   ACTIVE / STREAK
   --------------------------------------------------------------------- */
function markActive(){
  const t = dayKey();
  if(S.lastActive !== t){
    S.lastActive = t;
    S.streak++;
    if(S.streak > S.best) S.best = S.streak;
    log('SYSTEM','Streak: <b>'+S.streak+' day'+(S.streak>1?'s':'')+'</b>.');
  }
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
    subXP(m.xp, m.stat);
    S.qDone = Math.max(0, S.qDone - 1);
    beep(300,.1,'sawtooth');
  } else {
    store[id] = true;
    S.qDone++;
    markActive();
    addXP(m.xp, m.stat);
    if(ev) floatXP(ev.clientX, ev.clientY, m.xp, false);
  }
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
    addXP(b.xp, null);
    log('RAID','<b>'+b.name+'</b> &mdash; '+b.steps[i]);
    if(bossDone(bossId)){
      setTimeout(()=>overlay('BOSS CLEARED', b.name, 'The raid is complete.', false), 700);
      log('BOSS CLEARED','<b>'+b.name+'</b> has fallen.');
    }
  } else {
    S.sDone = Math.max(0, S.sDone - 1);
    subXP(b.xp, null);
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

/* ---------------------------------------------------------------------
   REWARDS — all written by Hadi
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
   COACH MESSAGES
   --------------------------------------------------------------------- */
function saveMsg(subject, body){
  S.msgs.unshift({s:subject, b:body, d:new Date().toLocaleString()});
  if(S.msgs.length > 30) S.msgs.pop();
  save();
}
