/* =====================================================================
   SOLO LEVELING — LIFE OS: CAREER, JOB HUNT HQ, INTERVIEW ARENA & CRM
   Interactive Job Application Kanban, Interview Question Drills,
   Portfolio Case Studies, and Networking Relationship Manager.
   ===================================================================== */

const CareerSystem = (function(){

  function initState(){
    if(!S) return;
    if(!S.jobHunt){
      S.jobHunt = {
        applications: [
          {
            id: 'job_sample_1',
            company: 'Target Saudi Agency (Riyadh)',
            role: 'Senior Performance Marketing Specialist',
            location: 'Riyadh, Saudi Arabia',
            salary: 'SAR 12,000 - 16,000',
            dateApplied: '',
            status: 'Researching', // Saved, Researching, Applied, HR Screen, Technical, Final, Offer, Rejected
            cvVersion: 'v3_Performance_Marketing_ATS.pdf',
            jobUrl: '',
            contact: 'HR Talent Acquisition / Marketing Director',
            nextAction: 'Finalize ATS CV and out-loud campaign defense drill',
            nextActionDate: '2026-11-15',
            notes: 'High priority target agency in Riyadh digital media sector.'
          }
        ],
        targetRoles: ['Senior Performance Marketing Specialist', 'Media Buyer', 'Paid Ads Lead'],
        metrics: {}
      };
    }
    if(!S.jobHunt.applications) S.jobHunt.applications = [];

    if(!S.interviewArena){
      S.interviewArena = {
        questions: [
          {
            id: 'q_meta_scaling',
            category: 'Meta Ads & Media Buying',
            question: 'How do you scale a winning Meta Ads campaign without triggering creative fatigue or sudden CPL spikes?',
            keyPoints: [
              'Horizontal scaling: Duplicating ad sets to test broad lookalikes, new angles, and distinct demographic slices.',
              'Vertical scaling: Incrementally raising budget by 15-20% every 48-72 hours within ABO or letting CBO auto-allocate.',
              'Creative testing engine: Maintaining a sandbox testing campaign to continuously supply validated top creatives.',
              'First-party data signals: Utilizing Conversions API (CAPI) and high-match quality event signals.'
            ],
            score: 4,
            lastPracticed: '2026-11-01'
          },
          {
            id: 'q_campaign_failure',
            category: 'Crisis Management & Diagnostics',
            question: 'Walk me through a campaign where CPL increased by 40% in a week. How did you diagnose and fix it?',
            keyPoints: [
              'Audit funnel stages: Separate front-end metrics (CTR, CPM) from back-end metrics (Lead Form completion rate, landing page bounce rate).',
              'Check frequency & ad fatigue: If frequency > 3.0 and CTR dropped, creative is fatigued -> refresh hooks.',
              'Audience saturation: Expand audience pool or shift to Advantage+ broad targeting with strong creative callouts.',
              'Audience overlap: Check Meta Ads Library for sudden competitor aggressive bidding or seasonal CPM spikes.'
            ],
            score: 5,
            lastPracticed: '2026-11-02'
          },
          {
            id: 'q_why_saudi',
            category: 'Regional Alignment & Career',
            question: 'Why are you transitioning to the Saudi Arabian market, and how does your experience fit Riyadh agencies?',
            keyPoints: [
              'Market dynamic: Saudi Arabia is the most dynamic digital and e-commerce market in MENA with massive demand for ROI-driven media buyers.',
              'Full-funnel execution: Experience managing end-to-end campaigns (TL 171K spend, 11,406 verified leads) proves ability to deliver real business outcomes.',
              'Preparedness: Relocation expenses cleared, visa logistics ready, fully committed to on-the-ground teamwork in Riyadh.'
            ],
            score: 4,
            lastPracticed: '2026-11-03'
          },
          {
            id: 'q_ga4_attribution',
            category: 'Analytics & Attribution',
            question: 'How do you set up attribution tracking between Meta Ads, GA4, and CRM to prove true ROAS?',
            keyPoints: [
              'UTM discipline: Clean dynamic UTM tags (utm_source, utm_medium, utm_campaign, utm_content, utm_id).',
              'GA4 Custom Events: Custom event mapping for key funnel transitions beyond standard pageviews.',
              'Attribution modeling: Comparing Data-Driven Attribution in GA4 with Meta 7-day click / 1-day view attribution window.',
              'CRM reconciliation: Daily/weekly lead exports matching Lead ID timestamps against CRM closed revenue.'
            ],
            score: 4,
            lastPracticed: '2026-11-04'
          }
        ]
      };
    }

    if(!S.portfolio){
      S.portfolio = {
        caseStudies: [
          {
            id: 'cs_ira_academy',
            title: 'IRA Academy — End-to-End Performance Marketing Engine',
            client: 'IRA Academy (Educational Programs)',
            spend: 'TL 171,000 (~$6,000+ USD)',
            leads: '11,406 Qualified Leads',
            programs: '27 Educational Cohorts',
            objective: 'Drive cost-effective qualified student admissions across competitive digital marketing courses.',
            strategy: 'Segmented multi-layer instant forms, lookalike audience waves, and high-retention video hooks.',
            execution: 'Built ABO testing structure for angle discovery, scaled top 3 ad sets via CBO, integrated custom conversion tracking.',
            results: 'Maintained stable CPL across 14 months while scaling volume 3.8x.',
            cvBullet: 'Managed TL 171K Meta Ads spend generating 11,406 qualified leads across 27 programs with sustained ROAS.'
          }
        ]
      };
    }

    if(!S.network){
      S.network = {
        contacts: [
          {
            id: 'net_1',
            name: 'Senior Agency Director',
            company: 'Top Media Agency Riyadh',
            role: 'Managing Director',
            country: 'Saudi Arabia',
            relationship: 'Recruiter / Hiring Manager',
            lastContact: '2026-10-20',
            nextFollowUp: '2026-11-20',
            notes: 'Expressed strong interest in performance marketers with direct educational lead generation experience.'
          }
        ]
      };
    }
  }

  /* ------------------------------------------------------------------
     JOB HUNT HQ
     ------------------------------------------------------------------ */
  const JOB_STATUSES = ['Saved', 'Researching', 'Applied', 'HR Screen', 'Technical', 'Final', 'Offer', 'Rejected'];

  function addApplication({ company, role, location, salary, status, contact, nextAction, nextActionDate, notes }){
    initState();
    if(!company || !company.trim()) return false;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);

    const app = {
      id: 'job_' + Date.now(),
      company: company.trim(),
      role: role ? role.trim() : 'Media Buyer / Performance Specialist',
      location: location ? location.trim() : 'Riyadh, Saudi Arabia',
      salary: salary ? salary.trim() : '',
      dateApplied: (status === 'Applied' || status === 'HR Screen' || status === 'Technical' || status === 'Final' || status === 'Offer') ? today : '',
      status: status || 'Researching',
      cvVersion: 'v3_Performance_Marketing_ATS.pdf',
      contact: contact ? contact.trim() : '',
      nextAction: nextAction ? nextAction.trim() : 'Follow up with recruiter',
      nextActionDate: nextActionDate || today,
      notes: (notes || '').trim()
    };

    S.jobHunt.applications.unshift(app);

    if(app.status === 'Applied'){
      if(typeof XpEngine !== 'undefined'){
        XpEngine.grantXP({ amount: 40, stat: 'career', source: 'career', reason: `Applied to ${app.company}` });
      }
    }

    if(typeof save === 'function') save();
    if(typeof log === 'function') log('JOB PIPELINE', `Added <b>${esc(app.company)}</b> (${esc(app.role)}) to Job Hunt HQ.`);
    return app;
  }

  function updateApplicationStatus(id, newStatus){
    initState();
    const app = S.jobHunt.applications.find(a => a.id === id);
    if(!app) return false;
    const oldStatus = app.status;
    app.status = newStatus;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);

    if(newStatus === 'Applied' && !app.dateApplied){
      app.dateApplied = today;
      if(typeof XpEngine !== 'undefined'){
        XpEngine.grantXP({ amount: 40, stat: 'career', source: 'career', reason: `Submitted application to ${app.company}` });
      }
    } else if(newStatus === 'Interview' || newStatus === 'HR Screen' || newStatus === 'Technical'){
      if(typeof XpEngine !== 'undefined'){
        XpEngine.grantXP({ amount: 60, stat: 'career', source: 'career', isBonus: true, reason: `Interview scheduled with ${app.company}` });
      }
      if(typeof ceremonyCard === 'function'){
        ceremonyCard({
          kicker: 'INTERVIEW MILESTONE',
          big: app.company,
          sub: 'Interview round reached in Saudi career transition!',
          stat: '+60 Career XP Awarded',
          rare: true
        });
      }
    } else if(newStatus === 'Offer'){
      if(typeof XpEngine !== 'undefined'){
        XpEngine.grantXP({ amount: 500, stat: 'career', source: 'career', isBonus: true, reason: `JOB OFFER CONQUERED: ${app.company}` });
      }
    }

    if(typeof save === 'function') save();
    if(typeof log === 'function') log('STATUS UPDATED', `<b>${esc(app.company)}</b> updated: ${oldStatus} &rarr; <b>${newStatus}</b>`);
    return true;
  }

  /* ------------------------------------------------------------------
     INTERVIEW ARENA
     ------------------------------------------------------------------ */
  function recordPracticeScore(questionId, score){
    initState();
    const q = S.interviewArena.questions.find(x => x.id === questionId);
    if(!q) return false;
    q.score = Math.max(1, Math.min(5, parseInt(score, 10)));
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    q.lastPracticed = today;

    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: 25, stat: 'selfdev', source: 'speaking', reason: `Practiced interview defense: ${q.category}` });
    }
    if(typeof save === 'function') save();
    return true;
  }

  /* ------------------------------------------------------------------
     NETWORKING CRM
     ------------------------------------------------------------------ */
  function addContact({ name, company, role, country, linkedin, relationship, nextFollowUp, notes }){
    initState();
    if(!name || !name.trim()) return false;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);

    const contact = {
      id: 'net_' + Date.now(),
      name: name.trim(),
      company: company ? company.trim() : '',
      role: role ? role.trim() : '',
      country: country || 'Saudi Arabia',
      linkedin: linkedin ? linkedin.trim() : '',
      relationship: relationship || 'Recruiter / Hiring Manager',
      lastContact: today,
      nextFollowUp: nextFollowUp || '',
      notes: (notes || '').trim()
    };

    S.network.contacts.unshift(contact);
    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: 20, stat: 'relations', source: 'network', reason: `Connected with ${contact.name}` });
    }
    if(typeof save === 'function') save();
    return contact;
  }

  /* ------------------------------------------------------------------
     RENDERERS
     ------------------------------------------------------------------ */
  function renderJobHuntHQ(){
    initState();
    const apps = S.jobHunt.applications;
    const appliedCount = apps.filter(a => a.status !== 'Saved' && a.status !== 'Researching').length;
    const interviewCount = apps.filter(a => a.status === 'HR Screen' || a.status === 'Technical' || a.status === 'Final').length;
    const offerCount = apps.filter(a => a.status === 'Offer').length;

    let html = `
      <div class="panel">
        <div class="st">
          <h2>Job Hunt HQ & Pipeline Command</h2>
          <span class="tag">ACTIVE OPPORTUNITIES</span>
        </div>
        <div class="hint">Systematic recruitment pipeline for high-leverage Media Buyer and Performance Marketing roles in Riyadh and Jeddah.</div>

        <!-- Metric Badges -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:16px 0;">
          <div style="background:rgba(63,169,255,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">TOTAL IN PIPELINE</div>
            <div style="font-size:22px;font-weight:700;color:#fff;margin:4px 0;">${apps.length}</div>
            <div style="font-size:11px;color:var(--muted);">Saved & In Progress</div>
          </div>
          <div style="background:rgba(37,224,122,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">SUBMITTED APPLICATIONS</div>
            <div style="font-size:22px;font-weight:700;color:var(--green);margin:4px 0;">${appliedCount}</div>
            <div style="font-size:11px;color:var(--muted);">${apps.length ? Math.round((appliedCount/apps.length)*100) : 0}% Conversion</div>
          </div>
          <div style="background:rgba(255,215,0,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">ACTIVE INTERVIEWS</div>
            <div style="font-size:22px;font-weight:700;color:var(--gold);margin:4px 0;">${interviewCount}</div>
            <div style="font-size:11px;color:var(--muted);">HR Screen & Technical</div>
          </div>
          <div style="background:rgba(168,85,247,0.06);border:1px solid var(--line);border-radius:6px;padding:12px;">
            <div style="font-size:10.5px;color:var(--muted);font-family:var(--hud);">OFFERS CONQUERED</div>
            <div style="font-size:22px;font-weight:700;color:var(--glow2);margin:4px 0;">${offerCount}</div>
            <div style="font-size:11px;color:var(--muted);">Ultimate Milestone</div>
          </div>
        </div>

        <!-- Add Button -->
        <div style="display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;">
          <button class="btn" onclick="CareerSystem.openAddAppModal()">+ Add Target Company / Role</button>
          <button class="btn secondary" onclick="goTab('interview')">Go to Interview Arena &rarr;</button>
          <button class="btn secondary" onclick="goTab('portfolio')">View Portfolio Case Studies &rarr;</button>
        </div>

        <!-- Applications Table / Kanban List -->
        <div class="st" style="margin-top:20px;"><h3>Application Pipelines</h3><span class="tag">STAGE STATUS</span></div>
        <div class="apps-list" style="margin-top:10px;">
    `;

    if(!apps.length){
      html += `<div style="padding:16px;text-align:center;color:var(--muted);background:rgba(0,0,0,0.2);border-radius:6px;">No applications added yet. Add target companies in Riyadh to start tracking.</div>`;
    } else {
      html += apps.map(a => `
        <div class="app-card" style="border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,0.02);padding:14px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
            <div>
              <b style="color:#fff;font-size:16px;">${esc(a.company)}</b>
              <span class="tag ${a.status === 'Offer' ? 'success' : (a.status === 'Applied' ? 'active' : '')}" style="margin-left:8px;">${esc(a.status)}</span>
              <div style="font-size:13px;color:var(--sys-blue);margin-top:3px;">${esc(a.role)} &middot; <span style="color:var(--muted);">${esc(a.location)}</span></div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <select onchange="CareerSystem.updateApplicationStatus('${a.id}', this.value)" style="background:var(--bg);color:#fff;border:1px solid var(--line);border-radius:4px;padding:4px 8px;font-size:12px;">
                ${JOB_STATUSES.map(st => `<option value="${st}" ${a.status === st ? 'selected' : ''}>${st}</option>`).join('')}
              </select>
            </div>
          </div>
          <div style="font-size:12px;color:var(--text);margin-top:8px;">
            <b>Next Action:</b> ${esc(a.nextAction || 'None')} &middot; <span style="color:var(--gold);">Due: ${esc(a.nextActionDate || 'TBD')}</span>
          </div>
          ${a.notes ? `<div style="font-size:11.5px;color:var(--muted);margin-top:4px;">${esc(a.notes)}</div>` : ''}
        </div>
      `).join('');
    }

    html += `</div></div>`;
    return html;
  }

  function renderInterviewArena(){
    initState();
    const questions = S.interviewArena.questions;

    let html = `
      <div class="panel">
        <div class="st">
          <h2>Interview Arena & Technical Defense</h2>
          <span class="tag">VERBAL FLUENCY & MASTERY</span>
        </div>
        <div class="hint">Simulated direct-response defense drills for Meta Ads scaling, CAPI attribution, and agency stakeholder questions in professional English.</div>

        <div class="questions-list" style="margin-top:16px;">
          ${questions.map((q, idx) => `
            <div class="q-card" style="border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,0.02);padding:16px;margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                <div style="flex:1;">
                  <span class="tag" style="font-size:10px;margin-bottom:6px;">${esc(q.category)}</span>
                  <div style="font-size:15px;font-weight:600;color:#fff;margin-top:4px;">${idx + 1}. "${esc(q.question)}"</div>
                </div>
                <div style="display:flex;gap:4px;align-items:center;">
                  <span style="font-size:11px;color:var(--muted);margin-right:6px;">Mastery:</span>
                  ${[1,2,3,4,5].map(star => `
                    <span onclick="CareerSystem.recordPracticeScore('${q.id}', ${star})" style="cursor:pointer;font-size:16px;color:${star <= q.score ? 'var(--gold)' : 'var(--line)'};">&#9733;</span>
                  `).join('')}
                </div>
              </div>

              <!-- Talking Points Checklist -->
              <div style="background:rgba(0,0,0,0.25);border-radius:4px;padding:10px 14px;margin-top:12px;">
                <div style="font-size:11px;color:var(--sys-blue);font-family:var(--hud);letter-spacing:1px;margin-bottom:6px;">KEY TALKING POINTS TO HIT:</div>
                <ul style="margin:0;padding-left:18px;font-size:12.5px;color:var(--text);line-height:1.5;">
                  ${q.keyPoints.map(pt => `<li>${esc(pt)}</li>`).join('')}
                </ul>
              </div>

              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:11px;color:var(--muted);">
                <span>Last practiced: ${esc(q.lastPracticed || 'Never')}</span>
                <button class="btn" style="font-size:11px;padding:4px 10px;" onclick="CareerSystem.practiceOutLoud('${q.id}')">Practice 2-Min Out Loud Drill &rarr;</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return html;
  }

  function renderPortfolioHQ(){
    initState();
    const csList = S.portfolio.caseStudies;

    let html = `
      <div class="panel">
        <div class="st">
          <h2>Portfolio HQ & Evidence Bank</h2>
          <span class="tag">PROOF OVER CLAIMS</span>
        </div>
        <div class="hint">Hard tangible proof of end-to-end campaign execution, lead generation, and ROAS. Connects directly to interview stories and ATS CV bullets.</div>

        <div class="cs-list" style="margin-top:16px;">
          ${csList.map(cs => `
            <div class="cs-card" style="border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,0.02);padding:18px;margin-bottom:16px;">
              <div style="font-family:var(--hud);font-size:11px;color:var(--sys-blue);letter-spacing:1px;">HERO CASE STUDY</div>
              <h3 style="font-size:18px;color:#fff;margin:4px 0 8px 0;">${esc(cs.title)}</h3>
              <div style="font-size:12.5px;color:var(--muted);">${esc(cs.client)}</div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:14px 0;">
                <div style="background:rgba(0,0,0,0.3);padding:8px 12px;border-radius:4px;border:1px solid var(--line);">
                  <div style="font-size:10px;color:var(--muted);">AD SPEND MANAGED</div>
                  <b style="color:var(--gold);font-size:15px;">${esc(cs.spend)}</b>
                </div>
                <div style="background:rgba(0,0,0,0.3);padding:8px 12px;border-radius:4px;border:1px solid var(--line);">
                  <div style="font-size:10px;color:var(--muted);">VERIFIED LEADS</div>
                  <b style="color:var(--green);font-size:15px;">${esc(cs.leads)}</b>
                </div>
                <div style="background:rgba(0,0,0,0.3);padding:8px 12px;border-radius:4px;border:1px solid var(--line);">
                  <div style="font-size:10px;color:var(--muted);">PROGRAMS DELIVERED</div>
                  <b style="color:var(--sys-blue);font-size:15px;">${esc(cs.programs)}</b>
                </div>
              </div>

              <div style="font-size:13px;color:var(--text);line-height:1.5;">
                <div style="margin-bottom:6px;"><b>Strategy:</b> ${esc(cs.strategy)}</div>
                <div style="margin-bottom:6px;"><b>Execution:</b> ${esc(cs.execution)}</div>
                <div><b>Results:</b> ${esc(cs.results)}</div>
              </div>

              <div style="background:rgba(0,212,255,0.05);border-left:3px solid var(--sys-blue);padding:10px 12px;border-radius:0 4px 4px 0;margin-top:14px;">
                <div style="font-size:10px;color:var(--sys-blue);font-family:var(--hud);letter-spacing:1px;">ATS RESUME BULLET</div>
                <div style="font-size:12.5px;color:#fff;margin-top:2px;">${esc(cs.cvBullet)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return html;
  }

  function renderNetworkHQ(){
    initState();
    const contacts = S.network.contacts;

    let html = `
      <div class="panel">
        <div class="st">
          <h2>Network CRM & Relationship Radar</h2>
          <span class="tag">ACTIVE RELATIONSHIPS</span>
        </div>
        <div class="hint">Strategic relationship tracking with recruiters, marketing directors, and industry peers across Egypt and the Gulf.</div>

        <div style="display:flex;gap:10px;margin:14px 0;flex-wrap:wrap;">
          <button class="btn" onclick="CareerSystem.openAddContactModal()">+ Add Strategic Contact</button>
        </div>

        <div class="contacts-list">
          ${contacts.map(c => `
            <div style="border:1px solid var(--line);border-radius:6px;background:rgba(255,255,255,0.02);padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
              <div>
                <b style="color:#fff;font-size:15px;">${esc(c.name)}</b>
                <span class="tag" style="margin-left:8px;font-size:10px;">${esc(c.relationship)}</span>
                <div style="font-size:12.5px;color:var(--sys-blue);margin-top:2px;">${esc(c.role)} &middot; <span style="color:var(--text);">${esc(c.company)}</span> (${esc(c.country)})</div>
                ${c.notes ? `<div style="font-size:11.5px;color:var(--muted);margin-top:4px;">${esc(c.notes)}</div>` : ''}
              </div>
              <div style="text-align:right;font-size:11px;color:var(--muted);">
                <div>Next Follow-up: <b style="color:var(--gold);">${esc(c.nextFollowUp || 'TBD')}</b></div>
                <button class="btn secondary" style="font-size:10.5px;padding:4px 8px;margin-top:6px;" onclick="CareerSystem.logFollowUpDone('${c.id}')">&#10003; Log Touchpoint</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return html;
  }

  /* Modal Helpers */
  function openAddAppModal(){
    const company = prompt('Target Company name:', 'Digital Agency Riyadh');
    if(!company) return;
    const role = prompt('Role Title:', 'Senior Performance Marketing Specialist');
    const salary = prompt('Expected Salary / Package (e.g. SAR 12,000 - 15,000):', 'SAR 14,000');
    addApplication({ company, role, salary, status: 'Researching' });
    if(typeof renderEverything === 'function') renderEverything();
  }

  function openAddContactModal(){
    const name = prompt('Contact Name:', 'Ahmed Al-Harbi');
    if(!name) return;
    const company = prompt('Company:', 'Riyadh Marketing Group');
    const role = prompt('Role:', 'Managing Director');
    addContact({ name, company, role, country: 'Saudi Arabia' });
    if(typeof renderEverything === 'function') renderEverything();
  }

  function practiceOutLoud(qId){
    const q = S.interviewArena.questions.find(x => x.id === qId);
    if(!q) return;
    alert(`🎙️ [OUT-LOUD PRACTICE DRILL]\n\nQuestion:\n"${q.question}"\n\nDirections:\n1. Set a 2-minute timer on your phone.\n2. Speak out loud in English without reading.\n3. Hit the key talking points!\n\nClick OK when completed to self-score.`);
    const score = prompt('Rate your delivery out of 5 stars (1 to 5):', '4');
    if(score) recordPracticeScore(qId, score);
    if(typeof renderEverything === 'function') renderEverything();
  }

  function logFollowUpDone(cId){
    initState();
    const c = S.network.contacts.find(x => x.id === cId);
    if(!c) return;
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    c.lastContact = today;
    if(typeof XpEngine !== 'undefined'){
      XpEngine.grantXP({ amount: 15, stat: 'relations', source: 'network', reason: `Followed up with ${c.name}` });
    }
    if(typeof save === 'function') save();
    if(typeof renderEverything === 'function') renderEverything();
  }

  return {
    initState: initState,
    addApplication: addApplication,
    updateApplicationStatus: updateApplicationStatus,
    recordPracticeScore: recordPracticeScore,
    addContact: addContact,
    logFollowUpDone: logFollowUpDone,
    practiceOutLoud: practiceOutLoud,
    renderJobHuntHQ: renderJobHuntHQ,
    renderInterviewArena: renderInterviewArena,
    renderPortfolioHQ: renderPortfolioHQ,
    renderNetworkHQ: renderNetworkHQ,
    openAddAppModal: openAddAppModal,
    openAddContactModal: openAddContactModal,
    getPipelineMetrics: function(){
      initState();
      const apps = (S.jobHunt && S.jobHunt.applications) || [];
      return {
        totalTargets: apps.length,
        portfolioSpendTL: 171000,
        portfolioLeads: 11406
      };
    },
    render: function(containerId){
      const el = document.getElementById(containerId || 'career-portal-content');
      if(el) el.innerHTML = renderJobHuntHQ();
    }
  };
})();

if(typeof window !== 'undefined'){
  window.CareerSystem = CareerSystem;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = CareerSystem;
}
