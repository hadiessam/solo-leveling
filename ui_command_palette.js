/**
 * SOLO LEVELING: LIFE OS — COMMAND PALETTE (CTRL+K), SYSTEM INBOX & MOBILE NAVIGATION
 * Global search across tasks, courses, lessons, notes, and actions.
 * Mobile-first sticky bottom navigation bar.
 * Zero paid APIs. 100% browser native.
 */

(function (window) {
  'use strict';

  const CommandPalette = {
    isOpen: false,
    selectedIndex: 0,
    filteredActions: [],

    init: function () {
      this.attachKeyboardListener();
      this.renderMobileBottomNav();
    },

    attachKeyboardListener: function () {
      document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          this.toggle();
        }
        // Escape closes
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    },

    toggle: function () {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function () {
      this.isOpen = true;
      let modal = document.getElementById('system-command-palette-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'system-command-palette-modal';
        document.body.appendChild(modal);
      }
      modal.innerHTML = this.renderModalHTML();
      modal.style.display = 'flex';
      
      const input = document.getElementById('cmd-palette-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      this.filter('');
    },

    close: function () {
      this.isOpen = false;
      const modal = document.getElementById('system-command-palette-modal');
      if (modal) modal.style.display = 'none';
    },

    getAllActions: function () {
      const actions = [
        // Navigation Tabs
        { title: 'Go to Command Center (Dashboard)', category: 'Navigation', icon: '🎯', fn: () => window.goTab('dash') },
        { title: 'Go to Tasks & Quests', category: 'Navigation', icon: '⚔️', fn: () => window.goTab('tasks') },
        { title: 'Go to Bassem School S-Rank Raid Boss', category: 'Navigation', icon: '👑', fn: () => { window.goTab('boss'); } },
        { title: 'Go to 36 Certification Courses', category: 'Navigation', icon: '📜', fn: () => window.goTab('courses') },
        { title: 'Go to Health, Sleep & Recovery Tracker', category: 'Life OS', icon: '🩺', fn: () => window.goTab('health') },
        { title: 'Go to Job Hunt HQ & Interview Arena', category: 'Life OS', icon: '💼', fn: () => window.goTab('career') },
        { title: 'Go to Time Blocker & Goal Cascades', category: 'Life OS', icon: '⏱️', fn: () => window.goTab('planner') },
        { title: 'Go to Expense Audit & Runway Calculator', category: 'Life OS', icon: '💰', fn: () => window.goTab('expenses') },
        { title: 'Go to Second Brain, ADRs & Lessons', category: 'Life OS', icon: '🧠', fn: () => window.goTab('brain') },
        { title: 'Go to English Speaking Drills', category: 'Navigation', icon: '🎙️', fn: () => window.goTab('speaking') },
        { title: 'Go to Vocabulary Vault', category: 'Navigation', icon: '📖', fn: () => window.goTab('vocab') },
        { title: 'Go to Hunter Status & Shadows', category: 'Navigation', icon: '👤', fn: () => window.goTab('hunter') },
        
        // System Actions
        { title: 'Toggle Recovery Mode (Reduced Workload)', category: 'System Action', icon: '🛡️', fn: () => { if (window.toggleRecoveryMode) window.toggleRecoveryMode(); } },
        { title: 'Export Full Encrypted Backup Snapshot (JSON)', category: 'System Action', icon: '💾', fn: () => { if (window.StorageManager) window.StorageManager.exportToFile(); } },
        { title: 'Open Diagnostics & Health Audit Panel', category: 'System Action', icon: '🔧', fn: () => { if (window.DiagnosticsModal) window.DiagnosticsModal.open(); } },
        { title: 'Add New Second Brain Note', category: 'Quick Action', icon: '📝', fn: () => { if (window.SecondBrain) window.SecondBrain.openNewNoteModal(); } },
        { title: 'Log Incident & Failure Lesson (+25 XP)', category: 'Quick Action', icon: '💡', fn: () => { if (window.SecondBrain) window.SecondBrain.openNewLessonModal(); } },
        { title: 'Log Workout / Gym Session', category: 'Quick Action', icon: '🏋️', fn: () => { if (window.HealthSystem) window.HealthSystem.logWorkoutModal(); } },
        { title: 'Log Weight & Body Metrics', category: 'Quick Action', icon: '⚖️', fn: () => { if (window.HealthSystem) window.HealthSystem.logWeightModal(); } }
      ];

      // Add Bassem chapters
      if (window.BASSEM_CURRICULUM && Array.isArray(window.BASSEM_CURRICULUM)) {
        window.BASSEM_CURRICULUM.forEach(phase => {
          actions.push({
            title: `Bassem Phase: ${phase.phaseNumber}. ${phase.titleEn}`,
            category: 'Bassem School',
            icon: '⚔️',
            fn: () => {
              window.goTab('boss');
              setTimeout(() => {
                const el = document.getElementById('bassem-phase-card-' + phase.phaseId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 300);
            }
          });
        });
      }

      // Add active daily tasks
      if (window.getDailyPriorities) {
        const priorities = window.getDailyPriorities();
        priorities.forEach(p => {
          actions.push({
            title: `Quest: ${p.name} (+${p.xp} XP)`,
            category: 'Daily Tasks',
            icon: '🎯',
            fn: () => {
              if (window.toggleLifeOSTask) window.toggleLifeOSTask(p.id);
            }
          });
        });
      }

      return actions;
    },

    filter: function (query) {
      const q = (query || '').toLowerCase().trim();
      const all = this.getAllActions();
      if (!q) {
        this.filteredActions = all.slice(0, 10);
      } else {
        this.filteredActions = all.filter(a => 
          a.title.toLowerCase().includes(q) || 
          a.category.toLowerCase().includes(q)
        ).slice(0, 12);
      }
      this.selectedIndex = 0;
      this.renderList();
    },

    renderList: function () {
      const listContainer = document.getElementById('cmd-palette-results');
      if (!listContainer) return;

      if (this.filteredActions.length === 0) {
        listContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 0.85rem;">No matching commands or resources found.</div>';
        return;
      }

      listContainer.innerHTML = this.filteredActions.map((a, idx) => {
        const isSel = idx === this.selectedIndex;
        return `
          <div onclick="window.CommandPalette.execute(${idx})" onmouseenter="window.CommandPalette.select(${idx})" style="padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.04); background: ${isSel ? 'rgba(0, 212, 255, 0.15)' : 'transparent'}; border-left: 3px solid ${isSel ? '#00d4ff' : 'transparent'};">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.1rem;">${a.icon}</span>
              <div>
                <div style="font-size: 0.88rem; font-weight: ${isSel ? '700' : '500'}; color: ${isSel ? '#fff' : '#cbd5e1'};">${a.title}</div>
              </div>
            </div>
            <span style="font-size: 0.72rem; color: #8fa0bc; background: rgba(255,255,255,0.06); padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${a.category}</span>
          </div>
        `;
      }).join('');
    },

    select: function (idx) {
      this.selectedIndex = idx;
      this.renderList();
    },

    execute: function (idx) {
      const action = this.filteredActions[idx];
      this.close();
      if (action && typeof action.fn === 'function') {
        action.fn();
      }
    },

    handleKeyNav: function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % (this.filteredActions.length || 1);
        this.renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredActions.length) % (this.filteredActions.length || 1);
        this.renderList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.execute(this.selectedIndex);
      }
    },

    renderModalHTML: function () {
      return `
        <div style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 99999; display: flex; align-items: flex-start; justify-content: center; padding-top: 10vh;" onclick="if(event.target === this) window.CommandPalette.close();">
          <div style="background: #0d131f; border: 1px solid rgba(0, 212, 255, 0.35); border-radius: 12px; width: 90%; max-width: 620px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8); overflow: hidden; display: flex; flex-direction: column;">
            <!-- Input Header -->
            <div style="display: flex; align-items: center; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3);">
              <span style="font-size: 1.2rem; margin-right: 12px; color: #00d4ff;">🔍</span>
              <input type="text" id="cmd-palette-input" placeholder="Type a command, task, course or keyword... (Esc to close)" oninput="window.CommandPalette.filter(this.value)" onkeydown="window.CommandPalette.handleKeyNav(event)" style="background: transparent; border: none; outline: none; color: #fff; font-size: 1.05rem; width: 100%; font-family: inherit;">
              <span style="font-size: 0.72rem; color: #64748b; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-weight: 700;">ESC</span>
            </div>
            <!-- Results List -->
            <div id="cmd-palette-results" style="max-height: 420px; overflow-y: auto;"></div>
            <!-- Footer -->
            <div style="padding: 8px 16px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: #64748b;">
              <div>Use <kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">↑</kbd> <kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">↓</kbd> to navigate, <kbd style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px;">↵</kbd> to select</div>
              <div>SOLO LEVELING COMMAND PALETTE</div>
            </div>
          </div>
        </div>
      `;
    },

    // ----------------------------------------------------
    // MOBILE BOTTOM NAVIGATION BAR
    // ----------------------------------------------------
    renderMobileBottomNav: function () {
      let nav = document.getElementById('mobile-bottom-navbar');
      if (!nav) {
        nav = document.createElement('nav');
        nav.id = 'mobile-bottom-navbar';
        document.body.appendChild(nav);
      }

      nav.innerHTML = `
        <div class="mobile-nav-item" onclick="window.goTab('dash')">
          <span class="mnav-icon">🎯</span>
          <span class="mnav-label">Command</span>
        </div>
        <div class="mobile-nav-item" onclick="window.goTab('tasks')">
          <span class="mnav-icon">⚔️</span>
          <span class="mnav-label">Tasks</span>
        </div>
        <div class="mobile-nav-item" onclick="window.goTab('boss')">
          <span class="mnav-icon">👑</span>
          <span class="mnav-label">Raids</span>
        </div>
        <div class="mobile-nav-item" onclick="window.goTab('lifestatus')">
          <span class="mnav-icon">🧭</span>
          <span class="mnav-label">Life OS</span>
        </div>
        <div class="mobile-nav-item" onclick="window.CommandPalette.toggle()">
          <span class="mnav-icon">⚡</span>
          <span class="mnav-label">Search</span>
        </div>
      `;
    }
  };

  window.CommandPalette = CommandPalette;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CommandPalette.init());
  } else {
    CommandPalette.init();
  }
})(window);
