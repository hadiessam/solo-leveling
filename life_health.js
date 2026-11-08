/* =====================================================================
   SOLO LEVELING — LIFE OS: HEALTH, FITNESS, SLEEP & ENERGY SYSTEM
   Local-first, private health dashboard, workout logger, sleep trends,
   deterministic recovery score, and functional physical vitality.
   ===================================================================== */

const HealthSystem = (function(){

  function initState(){
    if(!S) return;
    if(!S.healthData){
      S.healthData = {
        weightLog: [
          { date: '2026-10-15', weight: 85.0, bmi: 30.5, note: 'Initial baseline' }
        ],
        workouts: [],
        sleepLog: [],
        waterLog: {},
        stepsLog: {},
        recoveryScore: 85
      };
    }
    if(!S.healthData.weightLog) S.healthData.weightLog = [];
    if(!S.healthData.workouts) S.healthData.workouts = [];
    if(!S.healthData.sleepLog) S.healthData.sleepLog = [];
    if(!S.healthData.waterLog) S.healthData.waterLog = {};
    if(!S.healthData.stepsLog) S.healthData.stepsLog = {};
  }

  /* Calculate BMI: weight (kg) / (height (m) ^ 2) - Hadi height: 167 cm = 1.67m */
  function calculateBMI(weightKg){
    const h = 1.67;
    return Number((weightKg / (h * h)).toFixed(1));
  }

  /* Log Weight Entry */
  function logWeight(weight, note = ''){
    initState();
    const w = parseFloat(weight);
    if(isNaN(w) || w <= 40 || w >= 250) return false;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    const bmi = calculateBMI(w);

    S.healthData.weightLog.unshift({
      date: today,
      weight: w,
      bmi: bmi,
      note: note.trim()
    });

    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: 15, stat: 'health', source: 'health', reason: 'Logged Weight' });
    }
    if(typeof save === 'function') save();
    if(typeof log === 'function') log('HEALTH LOGGED', `Weight updated to <b>${w} kg</b> (BMI ${bmi}).`);
    return true;
  }

  /* Log Workout Session */
  function logWorkout({ exercise, category, sets, reps, weight, duration, notes }){
    initState();
    if(!exercise || !exercise.trim()) return false;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);

    const workout = {
      id: 'wko_' + Date.now(),
      date: today,
      exercise: exercise.trim(),
      category: category || 'Calisthenics', // Calisthenics, Cardio, Strength, Mobility
      sets: parseInt(sets, 10) || 3,
      reps: parseInt(reps, 10) || 10,
      weight: parseFloat(weight) || 0,
      duration: parseInt(duration, 10) || 20,
      notes: (notes || '').trim()
    };

    S.healthData.workouts.unshift(workout);

    // Dynamic XP based on workout duration
    const xpGain = Math.min(50, Math.max(20, Math.round(workout.duration * 1.5)));
    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({
        amount: xpGain,
        stat: 'health',
        source: 'health',
        sourceId: workout.id,
        reason: `Completed ${workout.exercise} workout`
      });
    }

    // Regenerate HP
    if(typeof regenHP === 'function') regenHP(15);
    else if(typeof S.hp === 'number') S.hp = Math.min(100, S.hp + 15);

    if(typeof SystemEvents !== 'undefined'){
      SystemEvents.emit('WORKOUT_LOGGED', workout);
    }
    if(typeof save === 'function') save();
    if(typeof log === 'function') log('WORKOUT CLEARED', `<b>${esc(workout.exercise)}</b> (${workout.duration}m) complete! <b>+${xpGain} XP</b>`);
    return true;
  }

  /* Log Sleep & Energy Entry */
  function logSleep({ durationHours, energyLevel, quality, notes }){
    initState();
    const dur = parseFloat(durationHours);
    if(isNaN(dur) || dur < 1 || dur > 24) return false;
    const energy = Math.max(1, Math.min(10, parseInt(energyLevel, 10) || 7));
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);

    S.healthData.sleepLog.unshift({
      date: today,
      duration: dur,
      energy: energy,
      quality: quality || 'Good', // Restful, Good, Disrupted, Poor
      notes: (notes || '').trim()
    });

    if(S.healthData.sleepLog.length > 60) S.healthData.sleepLog = S.healthData.sleepLog.slice(0, 60);

    calculateRecoveryScore();
    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: 15, stat: 'health', source: 'health', reason: 'Sleep Tracking' });
    }
    if(typeof save === 'function') save();
    return true;
  }

  /* Deterministic Recovery Score Calculation (0 - 100) */
  function calculateRecoveryScore(){
    initState();
    const sleep = S.healthData.sleepLog[0];
    if(!sleep) return 85;

    let score = 70;
    // Sleep duration factor (7-8.5 hours optimal)
    if(sleep.duration >= 7 && sleep.duration <= 8.5) score += 20;
    else if(sleep.duration >= 6 && sleep.duration < 7) score += 10;
    else if(sleep.duration < 6) score -= 15;

    // Subjective energy factor (1-10)
    score += (sleep.energy - 5) * 2;

    const finalScore = Math.max(20, Math.min(100, Math.round(score)));
    S.healthData.recoveryScore = finalScore;
    return finalScore;
  }

  /* Render Health Dashboard HTML */
  function renderHealthDashboard(){
    initState();
    const hd = S.healthData;
    const latestWeight = hd.weightLog[0] || { weight: 85.0, bmi: 30.5 };
    const latestSleep = hd.sleepLog[0] || { duration: 7.5, energy: 8, quality: 'Good' };
    const recovery = calculateRecoveryScore();

    let html = `
      <div class="panel">
        <div class="st">
          <h2>Health & Physical Vitality HQ</h2>
          <span class="tag">RECOVERY SCORE: ${recovery}%</span>
        </div>
        <div class="hint">Physical conditioning is the biological bedrock of mental stamina, interview confidence, and daily discipline.</div>

        <!-- Vitals Metrics Grid -->
        <div class="stat-boxes-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0;">
          <div class="stat-card" style="background:rgba(63,169,255,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:11px;color:var(--muted);letter-spacing:1px;font-family:var(--hud);">BODY WEIGHT</div>
            <div style="font-size:22px;font-weight:700;color:#fff;margin:4px 0;">${latestWeight.weight} kg</div>
            <div style="font-size:11.5px;color:var(--sys-blue);">BMI ${latestWeight.bmi} &middot; Target: 75 kg</div>
          </div>
          <div class="stat-card" style="background:rgba(37,224,122,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:11px;color:var(--muted);letter-spacing:1px;font-family:var(--hud);">LAST NIGHT SLEEP</div>
            <div style="font-size:22px;font-weight:700;color:var(--green);margin:4px 0;">${latestSleep.duration}h</div>
            <div style="font-size:11.5px;color:var(--muted);">${esc(latestSleep.quality)} &middot; Energy: ${latestSleep.energy}/10</div>
          </div>
          <div class="stat-card" style="background:rgba(255,215,0,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:11px;color:var(--muted);letter-spacing:1px;font-family:var(--hud);">WORKOUTS LOGGED</div>
            <div style="font-size:22px;font-weight:700;color:var(--gold);margin:4px 0;">${hd.workouts.length}</div>
            <div style="font-size:11.5px;color:var(--muted);">Consistent calisthenics & strength</div>
          </div>
          <div class="stat-card" style="background:rgba(168,85,247,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:11px;color:var(--muted);letter-spacing:1px;font-family:var(--hud);">READINESS STATUS</div>
            <div style="font-size:22px;font-weight:700;color:var(--glow2);margin:4px 0;">${recovery >= 80 ? 'Optimal' : (recovery >= 60 ? 'Moderate' : 'Fatigued')}</div>
            <div style="font-size:11.5px;color:var(--muted);">${recovery >= 80 ? 'High capacity for deep work' : 'Prioritize recovery'}</div>
          </div>
        </div>

        <!-- Quick Log Actions -->
        <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
          <button class="btn" onclick="HealthSystem.openLogWorkoutModal()">+ Log Workout</button>
          <button class="btn secondary" onclick="HealthSystem.openLogSleepModal()">+ Log Sleep / Energy</button>
          <button class="btn secondary" onclick="HealthSystem.openLogWeightModal()">+ Log Weight</button>
        </div>

        <!-- Recent Workouts List -->
        <div class="st" style="margin-top:24px;"><h3>Recent Workouts</h3><span class="tag">ACTIVITY LOG</span></div>
        <div class="recent-workouts-list" style="margin-top:10px;">
    `;

    if(!hd.workouts.length){
      html += `<div style="padding:16px;text-align:center;color:var(--muted);background:rgba(0,0,0,0.2);border-radius:6px;">No workouts logged yet. Take 15 minutes today for calisthenics or a brisk walk.</div>`;
    } else {
      html += hd.workouts.slice(0, 10).map(w => `
        <div class="workout-row" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border:1px solid var(--line);border-radius:5px;background:rgba(255,255,255,0.02);margin-bottom:8px;flex-wrap:wrap;gap:8px;">
          <div>
            <b style="color:#fff;font-size:14px;">${esc(w.exercise)}</b>
            <span class="tag" style="margin-left:8px;font-size:10px;">${esc(w.category)}</span>
            <div style="font-size:12px;color:var(--muted);margin-top:2px;">${w.sets} sets &times; ${w.reps} reps ${w.weight > 0 ? `(${w.weight} kg)` : ''} &middot; ${w.duration} min ${w.notes ? `&mdash; ${esc(w.notes)}` : ''}</div>
          </div>
          <div style="text-align:right;">
            <span style="font-family:var(--hud);font-size:11.5px;color:var(--gold);">+${Math.round(w.duration * 1.5)} XP</span>
            <div style="font-size:11px;color:var(--muted);">${esc(w.date)}</div>
          </div>
        </div>
      `).join('');
    }

    html += `</div></div>`;
    return html;
  }

  /* Modal Prompt Helpers */
  function openLogWorkoutModal(){
    const ex = prompt('Enter exercise name (e.g. Pushups & Squats, 20m Calisthenics, Brisk Walk):', 'Functional Calisthenics');
    if(!ex) return;
    const dur = prompt('Enter workout duration in minutes:', '20');
    const sets = prompt('Sets completed:', '3');
    const reps = prompt('Reps per set:', '12');
    logWorkout({ exercise: ex, category: 'Calisthenics', sets, reps, duration: dur });
    if(typeof renderEverything === 'function') renderEverything();
  }

  function openLogSleepModal(){
    const hours = prompt('Hours of sleep last night (e.g. 7.5):', '7.5');
    if(!hours) return;
    const energy = prompt('Morning energy level (1 to 10):', '8');
    logSleep({ durationHours: hours, energyLevel: energy, quality: 'Good' });
    if(typeof renderEverything === 'function') renderEverything();
  }

  function openLogWeightModal(){
    const w = prompt('Enter current weight in kg (e.g. 84.5):', '84.5');
    if(!w) return;
    logWeight(w);
    if(typeof renderEverything === 'function') renderEverything();
  }

  return {
    initState: initState,
    calculateBMI: calculateBMI,
    logWeight: logWeight,
    logWorkout: logWorkout,
    logSleep: logSleep,
    calculateRecoveryScore: calculateRecoveryScore,
    renderHealthDashboard: renderHealthDashboard,
    render: function(containerId){
      const el = document.getElementById(containerId || 'health-portal-content');
      if(el) el.innerHTML = renderHealthDashboard();
    },
    openLogWorkoutModal: openLogWorkoutModal,
    openLogSleepModal: openLogSleepModal,
    openLogWeightModal: openLogWeightModal
  };
})();

if(typeof window !== 'undefined'){
  window.HealthSystem = HealthSystem;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = HealthSystem;
}
