/**
 * SOLO LEVELING: LIFE OS — SYSTEM COMMAND CENTER & NEXT BEST ACTION ENGINE
 * Provides real-time tactical orientation, deterministic Next-Best-Action recommendation,
 * Cairo time-of-day awareness, energy level filtering, and quick Life OS module switching.
 * 100% Free, local-first, zero cloud dependencies.
 */

(function (window) {
  'use strict';

  const CommandCenter = {
    currentEnergy: 'high', // 'high', 'medium', 'low'

    init: function () {
      if (!window.S) return;
      if (!S.commandCenter) {
        S.commandCenter = {
          lastActionTaken: null,
          focusSession: null
        };
      }
    },

    setEnergy: function (level) {
      this.currentEnergy = level;
      const el = document.getElementById('cmd-nba-container');
      if (el) el.innerHTML = this.renderNextBestActionCard();
    },

    // ----------------------------------------------------
    // DETERMINISTIC NEXT BEST ACTION RECOMMENDATION ENGINE
    // ----------------------------------------------------
    getNextBestAction: function () {
      const now = window.SystemClock ? window.SystemClock.nowCairo() : new Date();
      const hour = now.getHours();
      const energy = this.currentEnergy;

      // 1. Check if daily rollover or midnight reflection needed (22:00 - 05:00)
      if (hour >= 22 || hour < 5) {
        if (window.FinanceSystem && S.expenses && (!S.expenses.history || S.expenses.history.length === 0)) {
          return {
            title: 'Daily Expense Audit & Night Log',
            category: 'Finance & Recovery',
            icon: '💰',
            reason: 'Cairo night wind-down: audit today’s spending to safeguard your runway before sleep.',
            actionLabel: 'Audit Expenses',
            actionFn: "window.goTab('expenses')"
          };
        }
        return {
          title: 'Night Reflection & Sleep Preparation',
          category: 'Health & Recovery',
          icon: '🌙',
          reason: 'Maintain optimal recovery score for tomorrow’s deep focus blocks. Aim for 7.5+ hours of sleep.',
          actionLabel: 'Open Health Log',
          actionFn: "window.goTab('health')"
        };
      }

      // 2. High Energy & Morning (06:00 - 13:00): Core Deep Work
      // Prioritize Bassem Raid Boss or Saudi Relocation CV/Portfolio
      if (energy === 'high') {
        if (window.BassemEngine && S.bassemProgress) {
          const nextLesson = window.BassemEngine.getNextIncompleteLesson();
          if (nextLesson) {
            return {
              title: `Bassem Raid Boss: ${nextLesson.title}`,
              category: 'AI Digital Marketing',
              icon: '⚔️',
              reason: `Deal damage to Raid Boss (${nextLesson.xp} XP). Phase: ${nextLesson.phaseTitle || 'Mastery'}. High cognitive energy match.`,
              actionLabel: 'Attack Boss (Lesson)',
              actionFn: `window.BassemEngine.completeLesson('${nextLesson.id}')`
            };
          }
        }

        // Check if top daily priority incomplete
        if (window.getDailyPriorities) {
          const priorities = window.getDailyPriorities();
          const pending = priorities.find(p => !(S.daily && S.daily[p.id]));
          if (pending) {
            return {
              title: pending.name,
              category: 'Daily Priority',
              icon: '🎯',
              reason: `Foundation Day Task: ${pending.why || 'Core daily progression objective'}. Takes ~${pending.duration || '25 min'}.`,
              actionLabel: 'Complete Quest',
              actionFn: `window.toggleLifeOSTask('${pending.id}', event)`
            };
          }
        }
      }

      // 3. Medium Energy: English Practice or Career Portfolio Review
      if (energy === 'medium') {
        const vocabPending = (S.vocabMastered ? Object.keys(S.vocabMastered).length : 0) < 150;
        if (vocabPending) {
          return {
            title: 'English B1->B2: Master 5 Advertising Vocab Words',
            category: 'English Lab',
            icon: '🗣️',
            reason: 'Reinforce marketing interview vocabulary (leverage, bottleneck, conversion funnel, CAPI).',
            actionLabel: 'Practice Vocab',
            actionFn: "window.goTab('vocab')"
          };
        }

        return {
          title: 'Review Saudi Job Pipeline & Network CRM',
          category: 'Saudi Relocation',
          icon: '🇸🇦',
          reason: 'Review target Riyadh & Jeddah digital marketing agencies and optimize recruiter touchpoints.',
          actionLabel: 'Open Career HQ',
          actionFn: "window.goTab('career')"
        };
      }

      // 4. Low Energy / Recovery Mode: Light maintenance
      return {
        title: 'Review Second Brain Playbooks & Lessons',
        category: 'Passive Learning',
        icon: '🧠',
        reason: 'Low energy mode: absorb high-converting Meta Ads notes or review past lessons without strain.',
        actionLabel: 'Open Second Brain',
        actionFn: "window.goTab('brain')"
      };
    },

    // ----------------------------------------------------
    // HTML RENDERING
    // ----------------------------------------------------
    renderNextBestActionCard: function () {
      const nba = this.getNextBestAction();
      const esc = window.esc || (s => s);

      return `
        <div style="background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(0, 212, 255, 0.35); border-left: 5px solid #00d4ff; border-radius: 12px; padding: 16px 20px; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🎯</span>
              <span style="font-size: 0.8rem; font-weight: 800; color: #00d4ff; text-transform: uppercase; letter-spacing: 1.5px;">SYSTEM DIRECTIVE: WHAT TO DO RIGHT NOW</span>
            </div>
            <!-- Energy Selector -->
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);">
              <span style="font-size: 0.72rem; color: #8fa0bc; font-weight: 700; margin-right: 4px;">ENERGY:</span>
              <button onclick="window.CommandCenter.setEnergy('high')" style="background: ${this.currentEnergy === 'high' ? '#10b981' : 'transparent'}; color: ${this.currentEnergy === 'high' ? '#000' : '#8fa0bc'}; border: none; border-radius: 12px; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; cursor: pointer;">High ⚡</button>
              <button onclick="window.CommandCenter.setEnergy('medium')" style="background: ${this.currentEnergy === 'medium' ? '#f59e0b' : 'transparent'}; color: ${this.currentEnergy === 'medium' ? '#000' : '#8fa0bc'}; border: none; border-radius: 12px; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; cursor: pointer;">Med ☕</button>
              <button onclick="window.CommandCenter.setEnergy('low')" style="background: ${this.currentEnergy === 'low' ? '#6366f1' : 'transparent'}; color: ${this.currentEnergy === 'low' ? '#fff' : '#8fa0bc'}; border: none; border-radius: 12px; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; cursor: pointer;">Low 🔋</button>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div style="flex: 1; min-width: 260px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 1.1rem;">${nba.icon}</span>
                <span style="font-size: 0.75rem; color: #38bdf8; font-weight: 700; text-transform: uppercase;">${esc(nba.category)}</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #f8fafc; margin: 0 0 4px 0; line-height: 1.3;">${esc(nba.title)}</h3>
              <p style="font-size: 0.85rem; color: #94a3b8; margin: 0; line-height: 1.4;">${esc(nba.reason)}</p>
            </div>
            <div>
              <button onclick="${nba.actionFn}" style="background: #00d4ff; color: #0a0e17; font-weight: 800; font-size: 0.9rem; padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 0 15px rgba(0, 212, 255, 0.4); transition: transform 0.15s ease;">
                <span>${esc(nba.actionLabel)}</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    renderQuickModulePills: function () {
      return `
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px;">
          <button onclick="window.goTab('lifestatus')" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; color: #cbd5e1; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
            <span>🧭</span> Life OS HQ
          </button>
          <button onclick="window.goTab('health')" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; color: #cbd5e1; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
            <span>🩺</span> Health & Sleep
          </button>
          <button onclick="window.goTab('career')" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; color: #cbd5e1; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
            <span>💼</span> Job Hunt & Arena
          </button>
          <button onclick="window.goTab('planner')" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; color: #cbd5e1; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
            <span>⏱️</span> Time Blocks & Reviews
          </button>
          <button onclick="window.goTab('expenses')" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; color: #cbd5e1; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
            <span>💰</span> Runway & Finance
          </button>
          <button onclick="window.goTab('brain')" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 14px; color: #cbd5e1; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap;">
            <span>🧠</span> Second Brain & ADRs
          </button>
        </div>
      `;
    },

    renderHeaderClockBar: function () {
      const now = window.SystemClock ? window.SystemClock.nowCairo() : new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' });
      const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Africa/Cairo' });
      
      let blockName = 'Afternoon Focus & Execution';
      const hr = now.getHours();
      if (hr >= 6 && hr < 12) blockName = 'Morning Foundation & English';
      else if (hr >= 12 && hr < 17) blockName = 'Deep Marketing & Saudi Prep';
      else if (hr >= 17 && hr < 21) blockName = 'Bassem School & Content';
      else blockName = 'Night Wind-down & Recovery';

      return `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; font-size: 0.78rem; color: #94a3b8; background: rgba(0,0,0,0.25); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <div>
            <span style="color: #00d4ff; font-weight: 700;">📍 CAIRO (EGY):</span> ${timeStr} &bull; ${dateStr}
          </div>
          <div>
            <span style="color: #f59e0b; font-weight: 700;">CURRENT BLOCK:</span> ${blockName}
          </div>
          <div>
            <span style="color: #10b981; font-weight: 700;">SYSTEM:</span> v50 LIFE OS MASTER (OFFLINE-FIRST)
          </div>
        </div>
      `;
    },

    renderFullCommandCenter: function () {
      this.init();
      return `
        <div id="system-command-center-widget" style="margin-bottom: 16px;">
          ${this.renderHeaderClockBar()}
          <div id="cmd-nba-container">
            ${this.renderNextBestActionCard()}
          </div>
          ${this.renderQuickModulePills()}
        </div>
      `;
    }
  };

  window.CommandCenter = CommandCenter;
  window.renderSystemCommandCenter = function () {
    return window.CommandCenter.renderFullCommandCenter();
  };
})(window);
