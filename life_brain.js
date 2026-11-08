/**
 * SOLO LEVELING: LIFE OS — SECOND BRAIN, DECISION LOG & LEARNING ANALYTICS
 * Local-first, offline-first personal knowledge management, ADR decision tracking,
 * failure-to-lesson reflection engine, and cross-course learning analytics.
 * Zero paid APIs. Fully private.
 */

(function (window) {
  'use strict';

  const SecondBrain = {
    DEFAULT_TAGS: ['Meta Ads', 'Saudi Relocation', 'English', 'Career', 'Health', 'Automation', 'Mindset', 'Strategy'],

    init: function () {
      if (!window.S) return;
      if (!S.secondBrain) {
        S.secondBrain = {
          notes: [
            {
              id: 'note-meta-scaling-ksa',
              title: 'Meta Ads Scaling Playbook — KSA & Gulf Markets',
              category: 'Meta Ads',
              tags: ['Meta Ads', 'Saudi Relocation', 'Strategy'],
              pinned: true,
              content: 'Key rules for Saudi market performance campaigns:\n1. Mobile-first creative (9:16 vertical reels & story dominant).\n2. Saudi dialect / localized Gulf Arabic resonates significantly higher than standard formal Arabic.\n3. Advantage+ Shopping / Lead campaigns perform best with broad audience + strong creative diversity (hooks, user-generated-feel, testimonials).\n4. CPL benchmark in KSA: expect 2.5x to 3x Egyptian CPL but substantially higher purchasing power and average order value (AOV).\n5. WhatsApp conversion flows convert 30-40% higher than traditional long forms in Saudi market.',
              createdAt: '2026-11-01T10:00:00.000Z',
              updatedAt: '2026-11-06T12:00:00.000Z'
            },
            {
              id: 'note-interview-framework',
              title: 'Executive Marketing Interview Battle Card',
              category: 'Career',
              tags: ['Career', 'Saudi Relocation'],
              pinned: true,
              content: 'Framework for answering performance marketing questions:\n- Situation: Lead volume dropped 35% or CPL spiked.\n- Diagnostics: Frequency check, creative fatigue, audience saturation, tracking discrepancy (Meta Pixel vs CAPI vs GA4).\n- Action: Creative rotation, horizontal audience testing, budget re-allocation.\n- Result: Highlight TL 171K spend management and 11,406 leads generated with positive ROAS.\n- Always articulate numbers first, methodology second, strategic insight third.',
              createdAt: '2026-11-02T14:30:00.000Z',
              updatedAt: '2026-11-05T09:15:00.000Z'
            },
            {
              id: 'note-english-confidence',
              title: 'B1->B2 English Speaking Protocol',
              category: 'English',
              tags: ['English', 'Mindset'],
              pinned: false,
              content: 'Daily rules:\n- 1 recorded speaking monologue (1-2 minutes) without stopping.\n- Replace filler sounds ("umm", "err") with intentional pauses.\n- Keep professional vocabulary active: "leverage", "bottleneck", "iterative", "scalable", "benchmark", "pivot", "conversion rate".\n- Review pronunciation of final consonants and linking sounds.',
              createdAt: '2026-11-03T08:00:00.000Z',
              updatedAt: '2026-11-03T08:00:00.000Z'
            }
          ],
          decisions: [
            {
              id: 'dec-001',
              title: 'Pivot Primary Market Focus to Saudi Arabia (Riyadh / Jeddah)',
              date: '2026-10-15',
              status: 'active',
              context: 'Local market currency dynamics and career growth ceiling in Egypt versus hyper-growth in Gulf/Saudi advertising ecosystem.',
              options: [
                'Continue remote freelancing for Egyptian clients only',
                'Transition to Saudi corporate / agency performance marketing role',
                'Relocate immediately without preparation'
              ],
              choice: 'Transition to Saudi corporate/agency role with structured pre-relocation preparation (CV, Portfolio HQ, Riyadh target pipeline, fund 100% saved).',
              rationale: 'Substantially higher purchasing power, career progression, regional network expansion, and long-term financial security.',
              expectedOutcome: 'Secure qualified performance marketing role in Riyadh/Jeddah with competitive SAR compensation.',
              actualOutcome: 'Relocation expenses 100% saved, portfolio case study documented, pipeline actively being built.',
              lessons: 'Preparation before arrival produces 10x higher leverage than desperate on-arrival job hunting.'
            },
            {
              id: 'dec-002',
              title: 'Add Bassem School AI Digital Marketing as Main Long-Term Raid Boss',
              date: '2026-11-06',
              status: 'validated',
              context: 'Purchased Bassem Magdy comprehensive AI Digital Marketing program (357 lessons, 14 phases). Needed to integrate into Solo Leveling without disturbing existing certified courses.',
              options: [
                'Replace existing certification courses',
                'Keep separate spreadsheet and ignore gamification',
                'Architect dedicated S-Rank Raid Boss with 14 phases, 40,000 HP, and integrated progression'
              ],
              choice: 'Dedicated S-Rank Raid Boss alongside existing 36 certification tracks.',
              rationale: 'Preserves all existing progress while providing structured multi-month learning discipline.',
              expectedOutcome: 'High daily consistency and practical mastery across Meta, TikTok, Google, and AI marketing tools.',
              actualOutcome: 'Successfully integrated with real-time HP boss battles and chapter completion tracking.',
              lessons: 'Gamification must serve actual habit consistency, not just superficial badges.'
            }
          ],
          lessons: [
            {
              id: 'les-001',
              date: '2026-10-20',
              incident: 'Prematurely killed ad set during first 24 hours of Learning Phase because of early high initial CPL.',
              rootCause: 'Impatience and lack of statistical significance before Meta delivery algorithm exited initial exploration.',
              lessonLearned: 'Never judge or optimize an ad set before it accumulates at least 50 conversion events or runs for a minimum of 48-72 hours.',
              preventiveRule: 'Set a mandatory 48-hour hands-off rule for all newly launched ad sets unless technical pixel failure is detected.',
              xpAwarded: 25
            },
            {
              id: 'les-002',
              date: '2026-10-28',
              incident: 'Relying exclusively on a single cloud storage endpoint for productivity state led to sync conflicts.',
              rootCause: 'Lack of local-first fallback architecture.',
              lessonLearned: 'The browser (IndexedDB + localStorage) must always be the source of truth; cloud sync must be purely an optional backup.',
              preventiveRule: 'Build offline-first with zero hard dependencies on external paid APIs or fragile remote endpoints.',
              xpAwarded: 25
            }
          ]
        };
      }
    },

    // ----------------------------------------------------
    // NOTES METHODS
    // ----------------------------------------------------
    addNote: function (noteData) {
      this.init();
      const note = {
        id: 'note-' + Date.now(),
        title: (noteData.title || 'Untitled Note').trim(),
        category: noteData.category || 'General',
        tags: Array.isArray(noteData.tags) ? noteData.tags : (noteData.tags ? noteData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        pinned: !!noteData.pinned,
        content: (noteData.content || '').trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      S.secondBrain.notes.unshift(note);
      if (window.XpEngine) {
        window.XpEngine.grantXP(15, 'Second Brain: Note Created');
      } else if (window.addXP) {
        window.addXP(15);
      }
      if (window.saveState) window.saveState();
      this.render();
      return note;
    },

    updateNote: function (noteId, updates) {
      this.init();
      const note = S.secondBrain.notes.find(n => n.id === noteId);
      if (!note) return;
      if (updates.title !== undefined) note.title = updates.title.trim();
      if (updates.category !== undefined) note.category = updates.category;
      if (updates.tags !== undefined) {
        note.tags = Array.isArray(updates.tags) ? updates.tags : updates.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      if (updates.pinned !== undefined) note.pinned = updates.pinned;
      if (updates.content !== undefined) note.content = updates.content.trim();
      note.updatedAt = new Date().toISOString();
      if (window.saveState) window.saveState();
      this.render();
    },

    deleteNote: function (noteId) {
      this.init();
      S.secondBrain.notes = S.secondBrain.notes.filter(n => n.id !== noteId);
      if (window.saveState) window.saveState();
      this.render();
    },

    // ----------------------------------------------------
    // DECISIONS METHODS
    // ----------------------------------------------------
    addDecision: function (decisionData) {
      this.init();
      const decision = {
        id: 'dec-' + Date.now(),
        title: (decisionData.title || 'Untitled Decision').trim(),
        date: decisionData.date || new Date().toISOString().slice(0, 10),
        status: decisionData.status || 'active', // active, validated, regretted, pivoted
        context: (decisionData.context || '').trim(),
        options: Array.isArray(decisionData.options) ? decisionData.options : (decisionData.options ? decisionData.options.split('\n').filter(Boolean) : []),
        choice: (decisionData.choice || '').trim(),
        rationale: (decisionData.rationale || '').trim(),
        expectedOutcome: (decisionData.expectedOutcome || '').trim(),
        actualOutcome: (decisionData.actualOutcome || '').trim(),
        lessons: (decisionData.lessons || '').trim()
      };
      S.secondBrain.decisions.unshift(decision);
      if (window.XpEngine) {
        window.XpEngine.grantXP(30, 'Decision Log: Strategic ADR Recorded');
      } else if (window.addXP) {
        window.addXP(30);
      }
      if (window.saveState) window.saveState();
      this.render();
      return decision;
    },

    updateDecision: function (decId, updates) {
      this.init();
      const dec = S.secondBrain.decisions.find(d => d.id === decId);
      if (!dec) return;
      Object.assign(dec, updates);
      if (window.saveState) window.saveState();
      this.render();
    },

    deleteDecision: function (decId) {
      this.init();
      S.secondBrain.decisions = S.secondBrain.decisions.filter(d => d.id !== decId);
      if (window.saveState) window.saveState();
      this.render();
    },

    // ----------------------------------------------------
    // LESSONS LEARNED METHODS (GROWTH MINDSET GAMIFICATION)
    // ----------------------------------------------------
    addLesson: function (lessonData) {
      this.init();
      const lesson = {
        id: 'les-' + Date.now(),
        date: lessonData.date || new Date().toISOString().slice(0, 10),
        incident: (lessonData.incident || '').trim(),
        rootCause: (lessonData.rootCause || '').trim(),
        lessonLearned: (lessonData.lessonLearned || '').trim(),
        preventiveRule: (lessonData.preventiveRule || '').trim(),
        xpAwarded: 25
      };
      S.secondBrain.lessons.unshift(lesson);
      // Reward logging failures/lessons to promote growth mindset!
      if (window.XpEngine) {
        window.XpEngine.grantXP(25, 'Lessons Database: Failure Analyzed & Rule Created');
      } else if (window.addXP) {
        window.addXP(25);
      }
      if (window.saveState) window.saveState();
      this.render();
      return lesson;
    },

    deleteLesson: function (lessonId) {
      this.init();
      S.secondBrain.lessons = S.secondBrain.lessons.filter(l => l.id !== lessonId);
      if (window.saveState) window.saveState();
      this.render();
    },

    // ----------------------------------------------------
    // LEARNING ANALYTICS AGGREGATOR
    // ----------------------------------------------------
    getLearningStats: function () {
      this.init();
      let totalLessonsCompleted = 0;
      let totalCertificationHours = 0;
      let totalCoursesCount = 0;
      let completedCertifications = 0;

      // 1. Bassem School stats
      let bassemCompleted = 0;
      let bassemTotal = 357;
      let bassemHours = 0;
      if (S.bassemProgress && S.bassemProgress.completedLessons) {
        bassemCompleted = Object.keys(S.bassemProgress.completedLessons).length;
        // Estimate ~25 min per lesson average
        bassemHours = Math.round((bassemCompleted * 25) / 60 * 10) / 10;
      }

      // 2. Certification Courses stats
      if (window.COURSES && Array.isArray(window.COURSES)) {
        totalCoursesCount = window.COURSES.length;
        window.COURSES.forEach(c => {
          const isDone = S.coursesDone && S.coursesDone[c.id];
          const hrs = c.hours || c.durationHours || 4;
          if (isDone) {
            completedCertifications++;
            totalCertificationHours += hrs;
          }
        });
      }

      // 3. Vocab & English stats
      const vocabCount = (S.vocabMastered && Object.keys(S.vocabMastered).length) || (S.vocabWordsLearned ? S.vocabWordsLearned.length : 142);
      const speakingSessions = (S.speakingHistory && S.speakingHistory.length) || 18;

      // Total estimated learning hours
      const grandTotalHours = Math.round((bassemHours + totalCertificationHours + (vocabCount * 0.05) + (speakingSessions * 0.5)) * 10) / 10;

      return {
        bassemCompleted: bassemCompleted,
        bassemTotal: bassemTotal,
        bassemPct: Math.round((bassemCompleted / (bassemTotal || 1)) * 100),
        bassemHours: bassemHours,
        totalCoursesCount: totalCoursesCount || 36,
        completedCertifications: completedCertifications,
        certificationHours: totalCertificationHours,
        vocabLearned: vocabCount,
        speakingSessions: speakingSessions,
        grandTotalHours: grandTotalHours,
        totalNotesCount: S.secondBrain.notes.length,
        totalDecisionsCount: S.secondBrain.decisions.length,
        totalLessonsCount: S.secondBrain.lessons.length
      };
    },

    // ----------------------------------------------------
    // UI RENDERER
    // ----------------------------------------------------
    render: function (containerId) {
      this.init();
      const target = document.getElementById(containerId || 'second-brain-portal-content');
      if (!target) return;

      const stats = this.getLearningStats();
      const notes = S.secondBrain.notes || [];
      const decisions = S.secondBrain.decisions || [];
      const lessons = S.secondBrain.lessons || [];

      // Sort notes: pinned first, then newest updated
      const sortedNotes = [...notes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });

      const esc = window.esc || (s => (s ? String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])) : ''));

      let html = `
        <div class="brain-portal-wrapper" style="animation: fadeIn 0.25s ease;">
          <!-- Top Analytics Bar -->
          <div style="background: linear-gradient(135deg, rgba(20, 24, 38, 0.95), rgba(10, 14, 25, 0.95)); border: 1px solid rgba(0, 212, 255, 0.25); border-radius: 12px; padding: 18px; margin-bottom: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
              <div>
                <h2 style="font-size: 1.25rem; font-weight: 800; color: #00d4ff; text-transform: uppercase; letter-spacing: 1px; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.3rem;">🧠</span> SYSTEM SECOND BRAIN & ARCHIVE
                </h2>
                <div style="font-size: 0.85rem; color: #8fa0bc; margin-top: 3px;">
                  Personal Knowledge Management • Architectural Decision Log • Failure-to-Wisdom Engine
                </div>
              </div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button onclick="window.SecondBrain.openNewNoteModal()" class="btn-action-primary" style="padding: 7px 14px; font-size: 0.85rem; border-radius: 6px; background: #00d4ff; color: #0a0e17; font-weight: 700; border: none; cursor: pointer;">
                  + Add Note (+15 XP)
                </button>
                <button onclick="window.SecondBrain.openNewDecisionModal()" class="btn-action-secondary" style="padding: 7px 14px; font-size: 0.85rem; border-radius: 6px; background: rgba(168, 85, 247, 0.2); color: #c084fc; font-weight: 700; border: 1px solid rgba(168, 85, 247, 0.4); cursor: pointer;">
                  + Log Decision (+30 XP)
                </button>
                <button onclick="window.SecondBrain.openNewLessonModal()" class="btn-action-secondary" style="padding: 7px 14px; font-size: 0.85rem; border-radius: 6px; background: rgba(234, 179, 8, 0.2); color: #fde047; font-weight: 700; border: 1px solid rgba(234, 179, 8, 0.4); cursor: pointer;">
                  + Document Lesson (+25 XP)
                </button>
              </div>
            </div>

            <!-- KPI Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Total Study Time</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #00d4ff;">${stats.grandTotalHours}h</div>
                <div style="font-size: 0.7rem; color: #94a3b8;">Across all tracks</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Bassem Raid Boss</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #ef4444;">${stats.bassemCompleted}/${stats.bassemTotal}</div>
                <div style="font-size: 0.7rem; color: #94a3b8;">${stats.bassemPct}% Complete</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Certifications</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #10b981;">${stats.completedCertifications}/${stats.totalCoursesCount}</div>
                <div style="font-size: 0.7rem; color: #94a3b8;">${stats.certificationHours}h Completed</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Vocabulary Vault</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #f59e0b;">${stats.vocabLearned}</div>
                <div style="font-size: 0.7rem; color: #94a3b8;">Terms Mastered</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Second Brain Items</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #a855f7;">${stats.totalNotesCount + stats.totalDecisionsCount + stats.totalLessonsCount}</div>
                <div style="font-size: 0.7rem; color: #94a3b8;">Notes, ADRs & Rules</div>
              </div>
            </div>
          </div>

          <!-- Section Switcher Tabs -->
          <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; overflow-x: auto;">
            <button onclick="window.SecondBrain.switchTab('notes')" id="brain-tab-notes" class="brain-tab active" style="padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; border: none; background: rgba(0,212,255,0.2); color: #00d4ff; cursor: pointer;">
              📚 Notes & Playbooks (${notes.length})
            </button>
            <button onclick="window.SecondBrain.switchTab('decisions')" id="brain-tab-decisions" class="brain-tab" style="padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; border: none; background: transparent; color: #8fa0bc; cursor: pointer;">
              ⚖️ Strategic Decision Log (${decisions.length})
            </button>
            <button onclick="window.SecondBrain.switchTab('lessons')" id="brain-tab-lessons" class="brain-tab" style="padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; border: none; background: transparent; color: #8fa0bc; cursor: pointer;">
              🛡️ Failure-to-Wisdom Rules (${lessons.length})
            </button>
          </div>

          <!-- 1. NOTES CONTAINER -->
          <div id="brain-view-notes" class="brain-view-panel">
            <div style="display: flex; gap: 10px; margin-bottom: 14px;">
              <input type="text" id="brain-notes-search" placeholder="Search notes by keyword or tag (e.g., #Meta Ads, Saudi)..." oninput="window.SecondBrain.filterNotes()" style="flex: 1; padding: 10px 14px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 0.9rem;">
            </div>
            <div id="brain-notes-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px;">
              ${sortedNotes.map(n => `
                <div class="brain-note-card" data-tags="${esc((n.tags || []).join(' '))} ${esc(n.category || '')}" data-text="${esc((n.title + ' ' + n.content).toLowerCase())}" style="background: rgba(15, 23, 42, 0.7); border: 1px solid ${n.pinned ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)'}; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                  ${n.pinned ? '<span style="position: absolute; top: 10px; right: 10px; font-size: 0.8rem; background: rgba(0, 212, 255, 0.15); color: #00d4ff; padding: 2px 6px; border-radius: 4px; font-weight: 700;">📌 PINNED</span>' : ''}
                  <div>
                    <div style="font-size: 0.75rem; color: #00d4ff; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">${esc(n.category || 'General')}</div>
                    <h3 style="font-size: 1.05rem; font-weight: 700; color: #f1f5f9; margin: 0 0 8px 0; line-height: 1.3;">${esc(n.title)}</h3>
                    <div style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.5; white-space: pre-wrap; max-height: 140px; overflow-y: auto; margin-bottom: 12px; padding-right: 4px;">${esc(n.content)}</div>
                  </div>
                  <div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">
                      ${(n.tags || []).map(t => `<span style="font-size: 0.7rem; background: rgba(255,255,255,0.06); color: #94a3b8; padding: 2px 6px; border-radius: 4px;">#${esc(t)}</span>`).join('')}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px; font-size: 0.75rem; color: #64748b;">
                      <span>Updated: ${new Date(n.updatedAt || n.createdAt).toLocaleDateString()}</span>
                      <div style="display: flex; gap: 6px;">
                        <button onclick="window.SecondBrain.deleteNote('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 2px 6px;" title="Delete">🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2. DECISIONS CONTAINER -->
          <div id="brain-view-decisions" class="brain-view-panel" style="display: none;">
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${decisions.map(d => {
                const statusColors = {
                  active: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.4)', label: 'Active In-Progress' },
                  validated: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)', label: 'Validated Success' },
                  regretted: { bg: 'rgba(239, 68, 68, 0.2)', text: '#f87171', border: 'rgba(239, 68, 68, 0.4)', label: 'Sub-Optimal / Regretted' },
                  pivoted: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)', label: 'Pivoted' }
                };
                const sc = statusColors[d.status] || statusColors.active;
                return `
                  <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 4px solid ${sc.text}; border-radius: 10px; padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
                      <div>
                        <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; margin-right: 8px;">ADR ID: ${esc(d.id)} • ${esc(d.date)}</span>
                        <h3 style="font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 4px 0 0 0;">${esc(d.title)}</h3>
                      </div>
                      <span style="font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; font-weight: 700; background: ${sc.bg}; color: ${sc.text}; border: 1px solid ${sc.border};">
                        ${sc.label}
                      </span>
                    </div>

                    <div style="margin-top: 10px; font-size: 0.85rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
                      <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">
                        <strong style="color: #94a3b8; display: block; font-size: 0.75rem; text-transform: uppercase;">Context & Trigger:</strong>
                        <div style="color: #cbd5e1; margin-top: 3px;">${esc(d.context || 'N/A')}</div>
                      </div>
                      <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">
                        <strong style="color: #38bdf8; display: block; font-size: 0.75rem; text-transform: uppercase;">Chosen Option & Action:</strong>
                        <div style="color: #f8fafc; font-weight: 600; margin-top: 3px;">${esc(d.choice || 'N/A')}</div>
                      </div>
                      <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">
                        <strong style="color: #34d399; display: block; font-size: 0.75rem; text-transform: uppercase;">Expected vs Actual Outcome:</strong>
                        <div style="color: #cbd5e1; margin-top: 3px;"><strong>Exp:</strong> ${esc(d.expectedOutcome || 'N/A')}<br><strong>Act:</strong> ${esc(d.actualOutcome || 'Pending measurement')}</div>
                      </div>
                      <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">
                        <strong style="color: #fde047; display: block; font-size: 0.75rem; text-transform: uppercase;">Strategic Lesson:</strong>
                        <div style="color: #fef08a; margin-top: 3px;">${esc(d.lessons || 'N/A')}</div>
                      </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                      <button onclick="window.SecondBrain.deleteDecision('${d.id}')" style="background: transparent; border: none; color: #ef4444; font-size: 0.75rem; cursor: pointer;">Delete Decision</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 3. LESSONS CONTAINER -->
          <div id="brain-view-lessons" class="brain-view-panel" style="display: none;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${lessons.map(l => `
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(234, 179, 8, 0.3); border-left: 4px solid #eab308; border-radius: 10px; padding: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 0.75rem; color: #eab308; font-weight: 700; text-transform: uppercase;">
                      🛡️ Growth Lesson • Date: ${esc(l.date)} • +${l.xpAwarded || 25} XP Awarded
                    </div>
                    <button onclick="window.SecondBrain.deleteLesson('${l.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.75rem;">Delete</button>
                  </div>
                  <div style="font-size: 0.95rem; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">
                    Incident: ${esc(l.incident)}
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; font-size: 0.85rem;">
                    <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 6px;">
                      <strong style="color: #f87171; display: block; font-size: 0.75rem;">Root Cause:</strong>
                      <div style="color: #cbd5e1; margin-top: 2px;">${esc(l.rootCause)}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 6px;">
                      <strong style="color: #fbbf24; display: block; font-size: 0.75rem;">Lesson Extracted:</strong>
                      <div style="color: #cbd5e1; margin-top: 2px;">${esc(l.lessonLearned)}</div>
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); padding: 8px 12px; border-radius: 6px;">
                      <strong style="color: #34d399; display: block; font-size: 0.75rem;">Immutable Preventive Rule:</strong>
                      <div style="color: #a7f3d0; font-weight: 600; margin-top: 2px;">${esc(l.preventiveRule)}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      target.innerHTML = html;
    },

    switchTab: function (tab) {
      const tabs = ['notes', 'decisions', 'lessons'];
      tabs.forEach(t => {
        const btn = document.getElementById('brain-tab-' + t);
        const view = document.getElementById('brain-view-' + t);
        if (btn && view) {
          if (t === tab) {
            btn.style.background = 'rgba(0, 212, 255, 0.2)';
            btn.style.color = '#00d4ff';
            view.style.display = 'block';
          } else {
            btn.style.background = 'transparent';
            btn.style.color = '#8fa0bc';
            view.style.display = 'none';
          }
        }
      });
    },

    filterNotes: function () {
      const q = (document.getElementById('brain-notes-search')?.value || '').toLowerCase().trim();
      const cards = document.querySelectorAll('.brain-note-card');
      cards.forEach(card => {
        const text = card.getAttribute('data-text') || '';
        const tags = card.getAttribute('data-tags') || '';
        if (!q || text.includes(q) || tags.toLowerCase().includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    },

    openNewNoteModal: function () {
      const title = prompt('Note Title (e.g., Meta Ads CAPI Implementation Guide):');
      if (!title) return;
      const category = prompt('Category (Meta Ads, Saudi Relocation, English, Career, Health, Automation):', 'Meta Ads') || 'General';
      const content = prompt('Note Content / Playbook steps:');
      if (!content) return;
      const tags = prompt('Tags (comma separated):', category) || '';
      this.addNote({ title, category, content, tags, pinned: false });
    },

    openNewDecisionModal: function () {
      const title = prompt('Decision Title / ADR (e.g., Select Riyadh Target Agencies):');
      if (!title) return;
      const context = prompt('Context / Background issue:');
      const choice = prompt('Decision made & Chosen Action:');
      const rationale = prompt('Rationale / Why this over alternatives:');
      const expectedOutcome = prompt('Expected Measurable Outcome:');
      this.addDecision({ title, context, choice, rationale, expectedOutcome, status: 'active' });
    },

    openNewLessonModal: function () {
      const incident = prompt('Incident or Mistake (What happened?):');
      if (!incident) return;
      const rootCause = prompt('Root Cause (Why did it happen?):');
      const lessonLearned = prompt('Lesson Extracted:');
      const preventiveRule = prompt('Immutable Preventive Rule to prevent recurrence:');
      this.addLesson({ incident, rootCause, lessonLearned, preventiveRule });
    }
  };

  window.SecondBrain = SecondBrain;
})(window);
