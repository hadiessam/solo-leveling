/* =====================================================================
   SOLO LEVELING — FEATURES 3
   Habit Strength Score + Negative Habits System
   =====================================================================
   These functions integrate with the existing Solo Leveling engine.
   They expect the global state object S, and use existing helpers:
   save(), damageHP(), healHP(), renderAll(), log(), sfx(), dayKey().
   ===================================================================== */

/* =====================================================================
   1. HABIT STRENGTH SCORE
   ===================================================================== */

/**
 * Update the strength score for a habit (daily mission).
 * Score ranges 0–100. Completing adds +5, missing subtracts -10.
 * The score is stored in S.habitStrength[missionId].
 *
 * @param {string} missionId  The daily mission id (e.g. 'd1', 'd5')
 * @param {boolean} completed  true = habit done, false = habit missed
 */
function updateHabitStrength(missionId, completed){
  if(!S.habitStrength) S.habitStrength = {};

  const current = S.habitStrength[missionId] || 0;
  const delta = completed ? 5 : -10;
  const next = Math.max(0, Math.min(100, current + delta));

  S.habitStrength[missionId] = next;
  save();

  /* log the change so the player sees what happened */
  const label = getStrengthLabel(next);
  if(completed){
    log('HABIT', 'Strength +5 → <b>' + next + '</b> (' + label + ')');
  } else {
    log('HABIT', 'Strength -10 → <b>' + next + '</b> (' + label + ')', true);
  }

  return next;
}

/**
 * Get the current strength score for a habit.
 * Returns 0 if the habit has never been tracked.
 *
 * @param {string} missionId  The daily mission id
 * @returns {number}  Strength score 0–100
 */
function getHabitStrength(missionId){
  if(!S.habitStrength) return 0;
  return S.habitStrength[missionId] || 0;
}

/**
 * Get a human-readable label for a strength score.
 *
 * @param {number} score  0–100
 * @returns {string}  Weak | Building | Strong | Unbreakable
 */
function getStrengthLabel(score){
  if(score >= 76) return 'Unbreakable';
  if(score >= 51) return 'Strong';
  if(score >= 26) return 'Building';
  return 'Weak';
}

/**
 * Get the CSS color for a strength score (for progress bars).
 *
 * @param {number} score  0–100
 * @returns {string}  CSS color value
 */
function getStrengthColor(score){
  if(score >= 76) return 'var(--green)';
  if(score >= 51) return 'var(--glow)';
  if(score >= 26) return 'var(--gold)';
  return 'var(--red)';
}

/**
 * Render strength bars for all daily missions in the Daily tab.
 * Call this from drawDaily() or renderAll() to show strength bars.
 * Each mission row gets a thin bar showing its habit strength.
 */
function renderStrengthBars(){
  const container = document.getElementById('strengthBars');
  if(!container) return;

  const av = available(DAILY);
  if(!av.length){
    container.innerHTML = '<div class="hint">No daily missions available yet.</div>';
    return;
  }

  container.innerHTML = av.map(m => {
    const score = getHabitStrength(m.id);
    const label = getStrengthLabel(score);
    const color = getStrengthColor(score);
    const pct = score; /* score is already 0-100 */

    return '<div class="strengthRow">'
      + '<div class="srHead">'
      +   '<span class="srName">' + esc(m.name) + '</span>'
      +   '<span class="srLabel" style="color:' + color + '">' + label + '</span>'
      +   '<span class="srScore" style="color:' + color + '">' + score + '</span>'
      + '</div>'
      + '<div class="srTrack"><i class="srFill" style="width:' + pct + '%;background:' + color + '"></i></div>'
      + '</div>';
  }).join('');
}

/**
 * Hook: call updateHabitStrength when a mission is toggled.
 * This is called from toggleMission() after the mission state changes.
 * We detect whether the mission was completed or un-checked.
 *
 * @param {string} missionId  The mission id
 * @param {boolean} completed  true if the mission is now done
 */
function onMissionToggled(missionId, completed){
  /* Only track daily missions for habit strength */
  const m = DAILY.find(x => x.id === missionId);
  if(!m) return;

  updateHabitStrength(missionId, completed);
  renderStrengthBars();
}

/* =====================================================================
   2. NEGATIVE HABITS
   ===================================================================== */

/**
 * Add a negative habit (bad habit) that damages HP when checked.
 * Negative habits reset daily — they represent things you did
 * that you shouldn't have done (e.g. "Ate junk food", "Skipped workout").
 *
 * Each negative habit has:
 *   id       — unique identifier
 *   name     — display name
 *   damage   — HP damage (5–20, clamped)
 *   done     — whether it has been checked today
 *   date     — the day it was created/last reset
 *
 * @param {string} name    Display name of the bad habit
 * @param {number} damage  HP damage (5–20, will be clamped)
 * @returns {string}  The new habit's id
 */
function addNegativeHabit(name, damage){
  if(!S.negativeHabits) S.negativeHabits = {};

  /* Clamp damage to 5–20 range */
  const dmg = Math.max(5, Math.min(20, parseInt(damage, 10) || 10));

  const id = 'neg_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  const today = dayKey();

  S.negativeHabits[id] = {
    id: id,
    name: name.trim(),
    damage: dmg,
    done: false,
    date: today
  };

  save();
  log('NEGATIVE HABIT', 'Added: <b>' + esc(name.trim()) + '</b> (-' + dmg + ' HP when checked)');
  sfx('penalty');
  renderAll();
  return id;
}

/**
 * Mark a negative habit as done — applies HP damage.
 * This is the "confess" action: you did the bad habit, you own it,
 * and it costs you HP. The habit is then marked done for today.
 *
 * @param {string} habitId  The negative habit id
 * @returns {boolean}  true if damage was applied, false otherwise
 */
function checkNegativeHabit(habitId){
  if(!S.negativeHabits) return false;
  const habit = S.negativeHabits[habitId];
  if(!habit) return false;

  /* Already done today — don't double-punish */
  if(habit.done) return false;

  habit.done = true;
  habit.date = dayKey();

  /* Apply HP damage using the existing damage system */
  const applied = damageHP(habit.damage, false);

  log('NEGATIVE HABIT', '<b>' + esc(habit.name) + '</b> — <b>-' + applied + ' HP</b>', true);
  sfx('damage');

  save();
  renderAll();
  return true;
}

/**
 * Remove a negative habit entirely.
 *
 * @param {string} habitId  The negative habit id
 * @returns {boolean}  true if removed, false if not found
 */
function removeNegativeHabit(habitId){
  if(!S.negativeHabits) return false;
  if(!S.negativeHabits[habitId]) return false;

  const name = S.negativeHabits[habitId].name;
  delete S.negativeHabits[habitId];

  save();
  log('NEGATIVE HABIT', 'Removed: <b>' + esc(name) + '</b>');
  renderAll();
  return true;
}

/**
 * Reset all negative habits for a new day.
 * Called from resets() when the day changes.
 * Sets done=false on all habits and updates the date.
 */
function resetNegativeHabits(){
  if(!S.negativeHabits) return;
  const today = dayKey();

  Object.values(S.negativeHabits).forEach(h => {
    h.done = false;
    h.date = today;
  });

  save();
}

/**
 * Get all negative habits as an array, sorted by name.
 *
 * @returns {Array}  Array of negative habit objects
 */
function getNegativeHabits(){
  if(!S.negativeHabits) return [];
  return Object.values(S.negativeHabits).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Render the negative habits panel.
 * Shows all negative habits with check buttons and remove buttons.
 * Call this from renderAll() or drawDaily().
 */
function renderNegativeHabits(){
  const container = document.getElementById('negativeHabits');
  if(!container) return;

  const habits = getNegativeHabits();

  if(!habits.length){
    container.innerHTML = '<div class="hint">No negative habits tracked. Add one below to hold yourself accountable.</div>';
    return;
  }

  container.innerHTML = '<div class="negHabitList">'
    + habits.map(h => {
        const done = h.done;
        return '<div class="negHabit ' + (done ? 'done' : '') + '">'
          + '<div class="nhInfo">'
          +   '<div class="nhName">' + (done ? ic('check',14) + ' ' : '') + esc(h.name) + '</div>'
          +   '<div class="nhDmg" style="color:var(--red)">-' + h.damage + ' HP</div>'
          + '</div>'
          + '<div class="nhActions">'
          +   (done
              ? '<span class="nhDone">DONE</span>'
              : '<button class="btn nhCheck" onclick="checkNegativeHabit(\'' + h.id + '\')">I did it</button>')
          +   '<button class="btn nhRemove" onclick="removeNegativeHabit(\'' + h.id + '\')">' + ic('x',12) + '</button>'
          + '</div>'
          + '</div>';
      }).join('')
    + '</div>';
}

/**
 * Show a prompt to add a new negative habit.
 * Uses the browser's prompt() for simplicity.
 */
function promptAddNegativeHabit(){
  const name = prompt('What bad habit did you do? (e.g. "Ate junk food", "Skipped workout")');
  if(!name || !name.trim()) return;

  const dmgStr = prompt('How much HP damage? (5–20, default 10)', '10');
  const dmg = parseInt(dmgStr, 10) || 10;

  addNegativeHabit(name, dmg);
}

/* =====================================================================
   INTEGRATION HOOKS
   These functions are called from the existing engine to wire
   the new features into the daily flow.
   ===================================================================== */

/**
 * Call this from resets() to reset negative habits on day change.
 * Add this line inside resets() after the daily reset:
 *   resetNegativeHabits();
 */
function hookResets(){
  resetNegativeHabits();
}

/**
 * Call this from toggleMission() to update habit strength.
 * Add this line inside toggleMission() after the mission toggle:
 *   onMissionToggled(id, !store[id]);
 */
function hookToggleMission(missionId, completed){
  onMissionToggled(missionId, completed);
}

/**
 * Call this from renderAll() to render the new panels.
 * Add these lines inside renderAll():
 *   renderStrengthBars();
 *   renderNegativeHabits();
 */
function hookRenderAll(){
  renderStrengthBars();
  renderNegativeHabits();
}

/* =====================================================================
   CSS STYLES (inject once)
   ===================================================================== */
(function injectStyles(){
  const style = document.createElement('style');
  style.textContent = `
    /* Habit Strength Bars */
    .strengthRow { margin: 4px 0; }
    .srHead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .srName { font-size: 12px; color: var(--text); }
    .srLabel { font-size: 11px; font-weight: 600; }
    .srScore { font-size: 11px; font-weight: 700; }
    .srTrack { height: 4px; background: rgba(255,255,255,.08); border-radius: 2px; overflow: hidden; }
    .srFill { display: block; height: 100%; border-radius: 2px; transition: width .3s; }

    /* Negative Habits */
    .negHabitList { display: flex; flex-direction: column; gap: 6px; }
    .negHabit {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 10px; border-radius: 8px;
      background: rgba(255,77,94,.08); border: 1px solid rgba(255,77,94,.2);
    }
    .negHabit.done { opacity: .5; background: rgba(255,255,255,.03); border-color: rgba(255,255,255,.08); }
    .nhInfo { display: flex; flex-direction: column; gap: 2px; }
    .nhName { font-size: 13px; color: var(--text); }
    .nhDmg { font-size: 11px; font-weight: 600; }
    .nhActions { display: flex; gap: 6px; align-items: center; }
    .nhDone { font-size: 11px; color: var(--muted); font-weight: 600; }
    .nhCheck {
      padding: 4px 10px; font-size: 11px; border-radius: 6px;
      background: rgba(255,77,94,.15); color: var(--red);
      border: 1px solid rgba(255,77,94,.3); cursor: pointer;
    }
    .nhCheck:hover { background: rgba(255,77,94,.25); }
    .nhRemove {
      padding: 4px 8px; font-size: 11px; border-radius: 6px;
      background: rgba(255,255,255,.05); color: var(--muted);
      border: 1px solid rgba(255,255,255,.1); cursor: pointer;
    }
    .nhRemove:hover { background: rgba(255,255,255,.1); }
  `;
  document.head.appendChild(style);
})();
