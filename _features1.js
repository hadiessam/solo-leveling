/* =====================================================================
   SOLO LEVELING — FEATURES 1
   Prestige System, Pause System, Character Stats
   ===================================================================== */

/* ---------------------------------------------------------------------
   PRESTIGE SYSTEM
   Reset progress for a permanent multiplier. Badges are kept.
   --------------------------------------------------------------------- */

const PRESTIGE_MAX_MULT = 2.0;   /* prestige multiplier cap */
const PRESTIGE_STEP     = 0.1;   /* each prestige adds +0.1 */

function doPrestige(){
  /* require a minimum level so prestige can't be farmed at level 1 */
  if(S.level < 10){
    sfx('error');
    alert('Prestige unlocks at level 10. You are level ' + S.level + '.');
    return;
  }
  if(!confirm('Prestige will reset your XP to 0 and level to 1.\n\n'
    + 'You keep: badges, shadow characters, class, courses, books, vocab.\n'
    + 'You gain: +' + PRESTIGE_STEP.toFixed(1) + ' permanent XP multiplier.\n\n'
    + 'Current multiplier: x' + getPrestigeMult().toFixed(1) + '\n'
    + 'New multiplier:     x' + (getPrestigeMult() + PRESTIGE_STEP).toFixed(1) + '\n\n'
    + 'Continue?')) return;

  /* reset core progression */
  S.xp   = 0;
  S.level = 1;

  /* keep badges — they are permanent achievements */
  /* keep shadowChars, classId, courses, books, vocab, vision, etc. */

  /* advance prestige */
  S.prestige = (S.prestige || 0) + 1;
  S.prestigeMult = Math.min(PRESTIGE_MAX_MULT, 1 + S.prestige * PRESTIGE_STEP);

  /* record which badges existed at this prestige for history */
  if(!S.prestigeBadges) S.prestigeBadges = [];
  S.prestigeBadges.push({ prestige: S.prestige, badges: S.badges.slice(), date: dayKey() });

  save();
  sfx('levelup');
  overlay('PRESTIGE ' + S.prestige,
    'x' + S.prestigeMult.toFixed(1) + ' XP MULTIPLIER',
    'You have awakened again. Badges kept. Multiplier increased.',
    false);
  log('PRESTIGE', 'Prestige <b>' + S.prestige + '</b>. Multiplier is now <b>x' + S.prestigeMult.toFixed(1) + '</b>.');
  if(typeof reactTo === 'function') reactTo('prestige');
  renderAll();
}

function getPrestigeMult(){
  return Math.min(PRESTIGE_MAX_MULT, 1 + (S.prestige || 0) * PRESTIGE_STEP);
}

/* apply prestige multiplier to any XP gain */
function applyPrestige(base){
  return Math.round(base * getPrestigeMult());
}

/* ---------------------------------------------------------------------
   PAUSE SYSTEM
   When paused: no penalties, no streak loss, missions don't reset.
   --------------------------------------------------------------------- */

function togglePause(){
  if(S.paused){
    /* resume */
    S.paused = false;
    S.pauseDate = '';
    S.pauseReason = '';
    save();
    sfx('success');
    overlay('SYSTEM RESUMED', 'PAUSED: OFF', 'The System is watching again. Missed missions carry penalties.', false);
    log('SYSTEM', 'System <b>resumed</b>. Penalties are active again.');
    if(typeof reactTo === 'function') reactTo('unpaused');
  } else {
    /* pause */
    S.paused = true;
    S.pauseDate = dayKey();
    S.pauseReason = '';
    save();
    sfx('close');
    overlay('SYSTEM PAUSED', 'PAUSED: ON', 'No penalties. No streak loss. Missions will not reset.', false);
    log('SYSTEM', 'System <b>paused</b>. No penalties while paused.');
    if(typeof reactTo === 'function') reactTo('paused');
  }
  renderAll();
}

function isPaused(){
  return !!S.paused;
}

/* guard: returns true if the system is paused (callers should bail out) */
function pausedGuard(){
  if(isPaused()){
    log('PAUSED', 'The System is paused. No penalties or streak changes while paused.', true);
    return true;
  }
  return false;
}

/* ---------------------------------------------------------------------
   CHARACTER STATS
   Spend XP to allocate stat points. Each stat gives a passive bonus.
   --------------------------------------------------------------------- */

const STAT_COST = 100;   /* XP per stat point */

const STAT_DEFS = {
  str: { name: 'Strength', icon: 'sword',  desc: '+5% boss XP per point' },
  int: { name: 'Intellect',icon: 'book',   desc: '+5% course/book XP per point' },
  agi: { name: 'Agility',  icon: 'bolt',   desc: '+2% crit chance per point' },
  end: { name: 'Endurance',icon: 'shield', desc: '-3% damage taken per point' }
};

function allocateStat(statName){
  const def = STAT_DEFS[statName];
  if(!def){ sfx('error'); return; }

  if(S.xp < STAT_COST){
    sfx('error');
    alert('Not enough XP. Allocating a stat point costs ' + STAT_COST + ' XP.');
    return;
  }
  if(!confirm('Spend ' + STAT_COST + ' XP to raise ' + def.name + ' by 1?\n\nCurrent: ' + (S[statName] || 0) + ' → ' + ((S[statName] || 0) + 1))) return;

  S.xp -= STAT_COST;
  S.level = Math.floor(S.xp / LEVEL_XP) + 1;
  S[statName] = (S[statName] || 0) + 1;
  S.statPoints = (S.statPoints || 0) + 1;

  save();
  sfx('badge');
  overlay('STAT ALLOCATED', def.name + ' +1', def.desc + '\n\nTotal points: ' + S.statPoints, false);
  log('STAT', 'Allocated a point to <b>' + def.name + '</b>. Now at <b>' + S[statName] + '</b>.');
  renderAll();
}

function getStatBonus(statName){
  const val = S[statName] || 0;
  switch(statName){
    case 'str': return val * 0.05;   /* +5% boss XP per point */
    case 'int': return val * 0.05;   /* +5% course/book XP per point */
    case 'agi': return val * 0.02;   /* +2% crit chance per point */
    case 'end': return val * 0.03;   /* -3% damage per point */
    default:    return 0;
  }
}

/* apply STR bonus to boss XP */
function applyStrBonus(base){
  return Math.round(base * (1 + getStatBonus('str')));
}

/* apply INT bonus to course/book XP */
function applyIntBonus(base){
  return Math.round(base * (1 + getStatBonus('int')));
}

/* apply END bonus to damage taken (reduces it) */
function applyEndReduction(dmg){
  const reduction = getStatBonus('end');
  return Math.max(0, Math.round(dmg * (1 - reduction)));
}

/* roll crit chance — returns true if crit */
function rollCrit(){
  const chance = getStatBonus('agi');
  return Math.random() < chance;
}

/* ---------------------------------------------------------------------
   HUD INTEGRATION — called from render.js drawHUD()
   --------------------------------------------------------------------- */

function drawPrestigeHUD(){
  const el = $('prestigeBadge');
  if(!el) return;
  el.textContent = 'P' + (S.prestige || 0) + ' · x' + getPrestigeMult().toFixed(1);
  el.title = 'Prestige ' + (S.prestige || 0) + '. Multiplier: x' + getPrestigeMult().toFixed(1) + '.';
}

function drawPauseHUD(){
  const el = $('pauseBadge');
  if(!el) return;
  if(isPaused()){
    el.textContent = 'PAUSED';
    el.style.color = 'var(--gold)';
    el.title = 'System is paused. No penalties or streak loss.';
  } else {
    el.textContent = 'ACTIVE';
    el.style.color = 'var(--green)';
    el.title = 'System is active.';
  }
}

function drawStatsHUD(){
  const el = $('statsPanel');
  if(!el) return;
  let html = '<div class="statsGrid">';
  for(const key of Object.keys(STAT_DEFS)){
    const def = STAT_DEFS[key];
    const val = S[key] || 0;
    const bonus = getStatBonus(key);
    html += '<div class="statRow">'
      + '<span class="statName">' + ic(def.icon, 16) + ' ' + def.name + '</span>'
      + '<span class="statVal">' + val + '</span>'
      + '<span class="statBonus">+' + (bonus * 100).toFixed(0) + '%</span>'
      + '</div>';
  }
  html += '</div>';
  if(S.statPoints) html += '<div class="statPoints">Points allocated: ' + S.statPoints + '</div>';
  el.innerHTML = html;
}
