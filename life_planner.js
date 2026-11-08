/* =====================================================================
   SOLO LEVELING — LIFE OS: PLANNER, TIME BLOCKER, GOALS & REVIEWS
   Internal Time Blocking, Cascading Goal Hierarchy (Vision -> Action),
   Multi-Cadence Reviews, and Anti-Burnout Protection.
   ===================================================================== */

const PlannerSystem = (function(){

  function initState(){
    if(!S) return;
    if(!S.planner){
      S.planner = {
        timeBlocks: {
          '08:00': { category: 'Health & Spiritual', title: 'Fajr, Morning Routine & Movement', active: true },
          '09:00': { category: 'English Lab', title: 'Speaking Drill & Recorded Campaign Defense', active: true },
          '10:30': { category: 'Deep Work', title: 'Portfolio Case Study & Technical Skill Expansion', active: true },
          '13:00': { category: 'Bassem School', title: 'Daily Raid Training (60+ min Mastery Course)', active: true },
          '16:00': { category: 'Saudi Transition', title: 'Travel Logistics & ATS CV Optimization', active: true },
          '18:00': { category: 'Physical Workout', title: 'Functional Calisthenics / Strength Routine', active: true },
          '20:00': { category: 'Evening Review', title: 'Daily Expense Logging & Reflection Checkpoint', active: true }
        },
        goalsHierarchy: {
          vision: 'Elite Saudi-Based Performance Marketing Lead & Future Digital Agency Sovereign',
          yearly: [
            {
              id: 'g_year_1',
              title: 'Secure High-Value Media Buyer Role in Riyadh / Jeddah (SAR 12k - 16k+)',
              targetDate: 'Late 2026 / Early 2027',
              progress: 75,
              status: 'in_progress',
              why: 'Establishes stable Gulf compensation, residency, and senior agency credential.'
            },
            {
              id: 'g_year_2',
              title: 'Achieve B2/C1 Spoken English Articulation & Technical Defense',
              targetDate: 'Mid 2027',
              progress: 65,
              status: 'in_progress',
              why: 'Eliminates hesitation in multinational agency and client pitches.'
            }
          ],
          quarterly: [
            {
              id: 'g_q4_1',
              title: 'Finalize Saudi Relocation Logistics (Flight & Departure Readiness)',
              targetDate: 'Late November 2026',
              progress: 85,
              status: 'in_progress'
            },
            {
              id: 'g_q4_2',
              title: 'Complete Phase 1 of Bassem School AI Digital Marketing Mastery',
              targetDate: 'December 2026',
              progress: 20,
              status: 'in_progress'
            }
          ]
        },
        reviews: {
          daily: {},
          weekly: {},
          monthly: {},
          quarterly: {},
          yearly: {}
        }
      };
    }
    if(!S.planner.timeBlocks) S.planner.timeBlocks = {};
    if(!S.planner.goalsHierarchy) S.planner.goalsHierarchy = { yearly: [], quarterly: [] };
    if(!S.planner.reviews) S.planner.reviews = { daily: {}, weekly: {}, monthly: {}, quarterly: {}, yearly: {} };
  }

  /* ------------------------------------------------------------------
     TIME BLOCKER
     ------------------------------------------------------------------ */
  const BLOCK_CATEGORIES = {
    'Deep Work': '#3fa9ff',
    'Bassem School': '#a855f7',
    'English Lab': '#25e07a',
    'Saudi Transition': '#ffd700',
    'Physical Workout': '#ff4d5e',
    'Health & Spiritual': '#00d4ff',
    'Evening Review': '#8b949e',
    'Rest & Recharge': '#4ade80'
  };

  function updateTimeBlock(timeKey, category, title){
    initState();
    S.planner.timeBlocks[timeKey] = {
      category: category,
      title: title || category,
      active: true
    };
    if(typeof save === 'function') save();
  }

  /* ------------------------------------------------------------------
     GOAL HIERARCHY
     ------------------------------------------------------------------ */
  function addGoal(tier, title, targetDate, why){
    initState();
    if(!title || !title.trim()) return;
    const goal = {
      id: 'g_' + Date.now(),
      title: title.trim(),
      targetDate: targetDate || '2027',
      progress: 0,
      status: 'in_progress',
      why: why || ''
    };
    if(tier === 'yearly') S.planner.goalsHierarchy.yearly.push(goal);
    else if(tier === 'quarterly') S.planner.goalsHierarchy.quarterly.push(goal);

    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: 30, stat: 'career', source: 'goal', reason: `Defined ${tier} goal` });
    }
    if(typeof save === 'function') save();
    return goal;
  }

  function updateGoalProgress(tier, goalId, progress){
    initState();
    const list = S.planner.goalsHierarchy[tier] || [];
    const g = list.find(x => x.id === goalId);
    if(!g) return;
    g.progress = Math.max(0, Math.min(100, parseInt(progress, 10)));
    if(g.progress === 100 && g.status !== 'completed'){
      g.status = 'completed';
      if(typeof XpEngine !== 'undefined'){
        XpEngine.grantXP({ amount: 200, stat: 'career', source: 'goal', isBonus: true, reason: `Goal Completed: ${g.title}` });
      }
    }
    if(typeof save === 'function') save();
  }

  /* ------------------------------------------------------------------
     MULTI-CADENCE REVIEWS
     ------------------------------------------------------------------ */
  function submitReview(cadence, { whatWorked, whatFailed, highLeverage, stopAction, continueAction, startAction }){
    initState();
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    const revKey = cadence === 'weekly' ? (typeof SystemClock !== 'undefined' ? SystemClock.weekKey() : today) :
                   (cadence === 'monthly' ? (typeof SystemClock !== 'undefined' ? SystemClock.monthKey() : today) : today);

    S.planner.reviews[cadence][revKey] = {
      date: today,
      cadence: cadence,
      whatWorked: whatWorked || '',
      whatFailed: whatFailed || '',
      highLeverage: highLeverage || '',
      stopAction: stopAction || '',
      continueAction: continueAction || '',
      startAction: startAction || ''
    };

    const xpTable = { daily: 25, weekly: 75, monthly: 150, quarterly: 300, yearly: 500 };
    const xpReward = xpTable[cadence] || 50;

    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: xpReward, stat: 'selfdev', source: 'review', reason: `Completed ${cadence} strategic review` });
    }

    if(typeof save === 'function') save();
    if(typeof log === 'function') log('STRATEGIC REVIEW', `Completed <b>${cadence.toUpperCase()} REVIEW</b>! <b>+${xpReward} XP</b>.`);
    return true;
  }

  /* ------------------------------------------------------------------
     RENDERERS
     ------------------------------------------------------------------ */
  function renderPlannerSection(){
    initState();
    const blocks = S.planner.timeBlocks;
    const goals = S.planner.goalsHierarchy;

    let html = `
      <div class="panel">
        <div class="st">
          <h2>Time Blocker & Daily Architecture</h2>
          <span class="tag">HIGH-LEVERAGE FOCUS</span>
        </div>
        <div class="hint">Structuring the daily 4+ available hours into non-negotiable execution blocks eliminates decision fatigue.</div>

        <!-- Time Blocks Schedule -->
        <div class="schedule-timeline" style="margin-top:16px;">
          ${Object.keys(blocks).sort().map(time => {
            const b = blocks[time];
            const color = BLOCK_CATEGORIES[b.category] || 'var(--sys-blue)';
            return `
              <div style="display:flex;align-items:center;padding:10px 14px;border:1px solid var(--line);border-left:4px solid ${color};background:rgba(255,255,255,0.02);border-radius:0 6px 6px 0;margin-bottom:8px;gap:14px;flex-wrap:wrap;">
                <b style="font-family:var(--hud);color:#fff;font-size:13px;flex:0 0 70px;">${time}</b>
                <span class="tag" style="background:${color}22;color:${color};border-color:${color}55;font-size:10.5px;">${esc(b.category)}</span>
                <span style="color:var(--text);font-size:13px;flex:1;">${esc(b.title)}</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Cascading Goal Hierarchy -->
        <div class="st" style="margin-top:28px;">
          <h2>Cascading Goal Hierarchy</h2>
          <span class="tag">VISION TO ACTION</span>
        </div>
        <div style="background:rgba(0,212,255,0.04);border:1px dashed var(--sys-blue);border-radius:6px;padding:12px 16px;margin:12px 0;">
          <div style="font-size:10.5px;color:var(--sys-blue);font-family:var(--hud);letter-spacing:1px;">NORTH STAR LIFE VISION</div>
          <div style="font-size:16px;font-weight:700;color:#fff;margin-top:4px;">"${esc(goals.vision)}"</div>
        </div>

        <div class="goals-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:14px;">
          <div>
            <h4 style="font-family:var(--hud);font-size:12px;color:var(--gold);letter-spacing:1px;margin-bottom:8px;">YEARLY ANCHORS (2026 - 2027)</h4>
            ${goals.yearly.map(g => `
              <div style="border:1px solid var(--line);border-radius:5px;background:rgba(255,255,255,0.02);padding:12px;margin-bottom:10px;">
                <b style="color:#fff;font-size:13px;">${esc(g.title)}</b>
                <div style="font-size:11px;color:var(--muted);margin:4px 0;">Target: ${esc(g.targetDate)} &middot; ${g.progress}% Complete</div>
                <div class="bar thin"><i style="width:${g.progress}%;background:var(--gold);"></i></div>
              </div>
            `).join('')}
          </div>
          <div>
            <h4 style="font-family:var(--hud);font-size:12px;color:var(--sys-blue);letter-spacing:1px;margin-bottom:8px;">QUARTERLY SPRINTS (Q4 2026)</h4>
            ${goals.quarterly.map(g => `
              <div style="border:1px solid var(--line);border-radius:5px;background:rgba(255,255,255,0.02);padding:12px;margin-bottom:10px;">
                <b style="color:#fff;font-size:13px;">${esc(g.title)}</b>
                <div style="font-size:11px;color:var(--muted);margin:4px 0;">Target: ${esc(g.targetDate)} &middot; ${g.progress}% Complete</div>
                <div class="bar thin"><i style="width:${g.progress}%;background:var(--sys-blue);"></i></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Review Launchers -->
        <div class="st" style="margin-top:28px;">
          <h2>Strategic Review Cadence</h2>
          <span class="tag">CONTINUOUS IMPROVEMENT</span>
        </div>
        <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap;">
          <button class="btn" onclick="PlannerSystem.openReviewModal('daily')">Complete Daily Reflection (+25 XP)</button>
          <button class="btn secondary" onclick="PlannerSystem.openReviewModal('weekly')">Complete Weekly Review (+75 XP)</button>
          <button class="btn secondary" onclick="PlannerSystem.openReviewModal('monthly')">Monthly Retrospective (+150 XP)</button>
        </div>
      </div>
    `;
    return html;
  }

  /* Modal Helpers */
  function openReviewModal(cadence){
    const worked = prompt(`[${cadence.toUpperCase()} REVIEW]\n\n1. What worked best and generated real traction?`, 'Consistent 60m Bassem School study and recorded interview defense drill');
    if(!worked) return;
    const failed = prompt('2. What caused friction or wasted time?', 'Unfocused phone scrolling during morning transition');
    const highLeverage = prompt('3. What is the single highest-leverage priority next?', 'Finalize flight ticket and complete IRA case study');
    submitReview(cadence, { whatWorked: worked, whatFailed: failed, highLeverage: highLeverage });
    if(typeof renderEverything === 'function') renderEverything();
  }

  return {
    initState: initState,
    updateTimeBlock: updateTimeBlock,
    addGoal: addGoal,
    updateGoalProgress: updateGoalProgress,
    submitReview: submitReview,
    renderPlannerSection: renderPlannerSection,
    getCurrentBlock: function(){
      initState();
      const now = typeof SystemClock !== 'undefined' ? SystemClock.nowCairo() : new Date();
      const hr = now.getHours();
      if(hr >= 6 && hr < 10) return { name: 'Morning Routine & Movement', category: 'Health & Spiritual' };
      if(hr >= 10 && hr < 14) return { name: 'Deep Work & Portfolio', category: 'Deep Work' };
      if(hr >= 14 && hr < 18) return { name: 'Bassem School & Skills', category: 'Bassem School' };
      if(hr >= 18 && hr < 22) return { name: 'Saudi Transition & Outreach', category: 'Saudi Transition' };
      return { name: 'Night Reflection & Recovery', category: 'Health & Spiritual' };
    },
    render: function(containerId){
      const el = document.getElementById(containerId || 'planner-portal-content');
      if(el) el.innerHTML = renderPlannerSection();
    },
    openReviewModal: openReviewModal
  };
})();

if(typeof window !== 'undefined'){
  window.PlannerSystem = PlannerSystem;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = PlannerSystem;
}
