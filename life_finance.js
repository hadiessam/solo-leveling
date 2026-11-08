/* =====================================================================
   SOLO LEVELING — LIFE OS: ADVANCED FINANCIAL PLANNING & RUNWAY
   Extends existing expenses.js with income modeling, runway calculator,
   fixed overhead, subscription audit, and relocation fund milestones.
   ===================================================================== */

const FinanceSystem = (function(){

  function initState(){
    if(!S) return;
    if(!S.financialPlan){
      S.financialPlan = {
        expectedMonthlyIncome: 12000, // EGP
        currency: 'EGP',
        liquidSavings: 45000, // EGP liquid buffer
        fixedOverhead: [
          { name: 'Housing & Utilities', amount: 3500 },
          { name: 'Core Nutrition & Groceries', amount: 3000 },
          { name: 'Internet & Communications', amount: 500 }
        ],
        subscriptions: [
          { name: 'Canva Pro', amount: 200, active: true },
          { name: 'CapCut Desktop Pro', amount: 180, active: true }
        ]
      };
    }
    if(!S.relocationFund){
      S.relocationFund = { target: 120000, current: 120000, currency: 'EGP' };
    }
  }

  /* Calculate Monthly Burn Rate from existing expenses and fixed overhead */
  function getBurnRateMetrics(){
    initState();
    const fp = S.financialPlan;
    const fixedTotal = fp.fixedOverhead.reduce((acc, it) => acc + (it.amount || 0), 0);
    const subTotal = fp.subscriptions.filter(s => s.active).reduce((acc, it) => acc + (it.amount || 0), 0);

    // Sum recent 30-day recorded expenses from S.expenses
    let recorded30Days = 0;
    const now = Date.now();
    for(const dateKey in (S.expenses || {})){
      const entryTime = new Date(dateKey).getTime();
      if((now - entryTime) <= 30 * 86400000){
        recorded30Days += (S.expenses[dateKey].total || 0);
      }
    }

    const estimatedMonthlyBurn = fixedTotal + subTotal + (recorded30Days > 0 ? recorded30Days : 2500);
    const runwayMonths = (fp.liquidSavings / Math.max(1, estimatedMonthlyBurn)).toFixed(1);
    const runwayDays = Math.round(Number(runwayMonths) * 30);

    return {
      fixedTotal: fixedTotal,
      subTotal: subTotal,
      variableSpent30Days: recorded30Days,
      estimatedMonthlyBurn: estimatedMonthlyBurn,
      liquidSavings: fp.liquidSavings,
      runwayMonths: runwayMonths,
      runwayDays: runwayDays
    };
  }

  /* Render Financial Planning Overview */
  function renderFinanceOverview(){
    initState();
    const metrics = getBurnRateMetrics();
    const rf = S.relocationFund || { target: 120000, current: 120000, currency: 'EGP' };
    const rfPct = Math.min(100, Math.round(((rf.current || 0) / (rf.target || 120000)) * 100));

    let html = `
      <div class="panel" style="margin-top:20px;">
        <div class="st">
          <h2>Financial Planning & Runway Architecture</h2>
          <span class="tag">CAPITAL PRESERVATION</span>
        </div>
        <div class="hint">Financial runway is hunter defense: having an unshakeable cash runway allows you to negotiate from strength for Riyadh salaries.</div>

        <!-- Metric Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0;">
          <div style="background:rgba(37,224,122,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">RELOCATION EXPENSES</div>
            <div style="font-size:22px;font-weight:700;color:var(--green);margin:4px 0;">&#10003; 100% PAID</div>
            <div style="font-size:11px;color:var(--muted);">Visa, medical & attestations cleared</div>
          </div>
          <div style="background:rgba(63,169,255,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">ESTIMATED RUNWAY</div>
            <div style="font-size:22px;font-weight:700;color:var(--sys-blue);margin:4px 0;">${metrics.runwayMonths} Months</div>
            <div style="font-size:11px;color:var(--muted);">${metrics.runwayDays} Days of total burn coverage</div>
          </div>
          <div style="background:rgba(255,215,0,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">ESTIMATED MONTHLY BURN</div>
            <div style="font-size:22px;font-weight:700;color:var(--gold);margin:4px 0;">EGP ${metrics.estimatedMonthlyBurn.toLocaleString()}</div>
            <div style="font-size:11px;color:var(--muted);">Fixed overhead + essentials</div>
          </div>
          <div style="background:rgba(168,85,247,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">TARGET RIYADH PACKAGE</div>
            <div style="font-size:22px;font-weight:700;color:var(--glow2);margin:4px 0;">SAR 12k - 16k+</div>
            <div style="font-size:11px;color:var(--muted);">(~EGP 150k - 200k/mo equivalence)</div>
          </div>
        </div>

        <!-- Relocation Fund Progress -->
        <div style="background:rgba(0,0,0,0.25);border:1px solid var(--line);border-radius:6px;padding:14px;margin-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:6px;">
            <span><b>Saudi Relocation Fund:</b> EGP ${rf.current.toLocaleString()} / ${rf.target.toLocaleString()}</span>
            <b style="color:var(--green);">${rfPct}% SETTLED</b>
          </div>
          <div class="bar thin"><i style="width:${rfPct}%;background:var(--green);"></i></div>
        </div>
      </div>
    `;
    return html;
  }

  return {
    initState: initState,
    getBurnRateMetrics: getBurnRateMetrics,
    renderFinanceOverview: renderFinanceOverview,
    getRunwaySummary: function(){
      initState();
      return {
        runwayMonths: 8.5,
        saudiRelocationFundStatus: { paid: true, milestone: '100% Cleared' }
      };
    },
    render: function(containerId){
      const el = document.getElementById(containerId || 'expenses');
      if(el) el.innerHTML = renderFinanceOverview();
    }
  };
})();

if(typeof window !== 'undefined'){
  window.FinanceSystem = FinanceSystem;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = FinanceSystem;
}
