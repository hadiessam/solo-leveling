/* =====================================================================
   SOLO LEVELING — MONEY EXPENSES CALENDAR & FINANCIAL MEMORY LEDGER
   Track daily spending, navigate past records, and search financial memory.
   ===================================================================== */

const EXPENSE_CATEGORIES = {
  food:          { label: 'Food & Drinks',       icon: '🍕', color: '#ff6b6b' },
  transport:     { label: 'Transport & Travel',   icon: '🚗', color: '#4ecdc4' },
  bills:         { label: 'Bills & Utilities',   icon: '💡', color: '#ffe66d' },
  shopping:      { label: 'Shopping & Gear',     icon: '🛍️', color: '#a29bfe' },
  health:        { label: 'Health & Medical',    icon: '💊', color: '#fd79a8' },
  education:     { label: 'Education & Courses', icon: '📚', color: '#00b894' },
  entertainment: { label: 'Entertainment & Fun', icon: '🎮', color: '#e17055' },
  other:         { label: 'Other & General',     icon: '📦', color: '#b2bec3' }
};

let expNavYear = null;
let expNavMonth = null; // 0-11
let expSelectedDate = null;
let expSearchQuery = '';
let expFilterCat = 'all';

function initExpenseNav(){
  const now = new Date();
  if(expNavYear === null || expNavMonth === null){
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const curKey = curYear + '-' + String(curMonth + 1).padStart(2, '0');

    // Check if current month has any expenses
    let hasCurMonthExpenses = false;
    if(S && S.expenses){
      for(const k of Object.keys(S.expenses)){
        if(k.startsWith(curKey)){
          hasCurMonthExpenses = true;
          break;
        }
      }
    }

    if(!hasCurMonthExpenses && S && S.expenses && Object.keys(S.expenses).length > 0){
      // Default to latest month that has logged data (e.g. October 2026)
      const sortedKeys = Object.keys(S.expenses).sort();
      const latestKey = sortedKeys[sortedKeys.length - 1];
      const parts = latestKey.split('-');
      expNavYear = parseInt(parts[0], 10);
      expNavMonth = parseInt(parts[1], 10) - 1;
      expSelectedDate = latestKey;
    } else {
      expNavYear = curYear;
      expNavMonth = curMonth;
      expSelectedDate = dayKey();
    }
  }

  if(!expSelectedDate){
    expSelectedDate = dayKey();
  }
}

function changeExpenseMonth(delta){
  initExpenseNav();
  expNavMonth += delta;
  if(expNavMonth < 0){
    expNavMonth = 11;
    expNavYear--;
  } else if(expNavMonth > 11){
    expNavMonth = 0;
    expNavYear++;
  }
  drawExpenses();
}

function jumpExpenseToToday(){
  const now = new Date();
  expNavYear = now.getFullYear();
  expNavMonth = now.getMonth();
  expSelectedDate = dayKey();
  const inp = document.getElementById('expenseDate');
  if(inp) inp.value = expSelectedDate;
  drawExpenses();
}

function selectExpenseDate(dateKey){
  expSelectedDate = dateKey;
  const inp = document.getElementById('expenseDate');
  if(inp) inp.value = dateKey;
  drawExpenseCalendar();
}

function onExpenseSearch(val){
  expSearchQuery = (val || '').trim();
  drawExpenseSearchLedger();
}

function setExpenseFilterCat(catKey){
  expFilterCat = catKey;
  drawExpenseSearchLedger();
}

function drawExpenses(){
  initExpenseNav();
  drawExpenseCalendar();
  drawExpenseSummary();
  drawExpenseSearchLedger();
}

function drawExpenseCalendar(){
  const el = document.getElementById('expenseCalendar');
  if(!el) return;

  initExpenseNav();

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const monthNamesAr = [
    'يناير','فبراير','مارس','أبريل','مايو','يونيو',
    'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'
  ];

  const year = expNavYear;
  const month = expNavMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Calculate month spend stats
  const mPrefix = year + '-' + String(month + 1).padStart(2, '0');
  let monthTotal = 0;
  let loggedDaysCount = 0;

  if(S && S.expenses){
    Object.keys(S.expenses).forEach(function(k){
      if(k.startsWith(mPrefix)){
        const list = S.expenses[k] || [];
        if(list.length > 0){
          loggedDaysCount++;
          list.forEach(function(e){ monthTotal += (e.amount || 0); });
        }
      }
    });
  }

  let html = '<div class="exp-nav-bar">';
  html += '<button class="xbtn exp-nav-btn" onclick="changeExpenseMonth(-1)">◀ ' + (month === 0 ? 'December' : monthNames[month - 1]) + '</button>';
  html += '<div class="exp-nav-center">';
  html += '<h3 class="exp-nav-title">' + monthNames[month] + ' ' + year + ' <span class="exp-nav-ar">(' + monthNamesAr[month] + ')</span></h3>';
  html += '<div class="exp-nav-sub">' + loggedDaysCount + ' days logged &middot; ' + monthTotal.toFixed(2) + ' EGP total</div>';
  html += '</div>';
  html += '<div class="exp-nav-actions">';
  html += '<button class="xbtn exp-nav-btn" onclick="jumpExpenseToToday()">Today 🎯</button>';
  html += '<button class="xbtn exp-nav-btn" onclick="changeExpenseMonth(1)">' + (month === 11 ? 'January' : monthNames[month + 1]) + ' ▶</button>';
  html += '</div>';
  html += '</div>';

  html += '<div class="exp-cal-grid">';

  /* day headers */
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  dayNames.forEach(function(d){
    html += '<div class="exp-cal-day-header">' + d + '</div>';
  });

  /* empty cells */
  for(let i = 0; i < firstDay; i++){
    html += '<div class="exp-cal-cell empty"></div>';
  }

  /* days */
  for(let day = 1; day <= daysInMonth; day++){
    const dateKey = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    const expenses = (S && S.expenses && S.expenses[dateKey]) || [];
    const total = expenses.reduce(function(sum, e){ return sum + (e.amount || 0); }, 0);
    const isToday = (dateKey === dayKey());
    const isSelected = (dateKey === expSelectedDate);
    const hasExpenses = expenses.length > 0;

    // Collect category color dots
    const catsPresent = {};
    expenses.forEach(function(e){
      if(e.category) catsPresent[e.category] = true;
    });
    const dotColors = Object.keys(catsPresent).map(function(c){
      return (EXPENSE_CATEGORIES[c] && EXPENSE_CATEGORIES[c].color) || '#b2bec3';
    });

    let cellClass = 'exp-cal-cell';
    if(isToday) cellClass += ' today';
    if(isSelected) cellClass += ' selected';
    if(hasExpenses) cellClass += ' has-expenses';

    html += '<div class="' + cellClass + '" onclick="selectExpenseDate(\'' + dateKey + '\')">';
    html += '<div class="exp-cal-day-num">' + day + (isToday ? ' <span class="exp-today-badge">TODAY</span>' : '') + '</div>';

    if(hasExpenses){
      if(total <= 0.02){
        html += '<span class="exp-cal-total zero">0 EGP</span>';
      } else {
        html += '<span class="exp-cal-total">' + total.toFixed(0) + ' EGP</span>';
      }
      if(dotColors.length > 0){
        html += '<div class="exp-cal-dots">';
        dotColors.slice(0, 4).forEach(function(col){
          html += '<span class="exp-cat-dot" style="background:' + col + '"></span>';
        });
        html += '</div>';
      }
    }
    html += '</div>';
  }

  html += '</div>';

  /* selected date inspector & fast logger */
  const activeSelected = expSelectedDate || dayKey();
  const selectedExpenses = (S && S.expenses && S.expenses[activeSelected]) || [];
  const selectedTotal = selectedExpenses.reduce(function(sum, e){ return sum + (e.amount || 0); }, 0);

  html += '<div class="exp-day-inspector">';
  html += '<div class="exp-inspector-header">';
  html += '<div><h4>📅 Day Ledger: <span style="color:var(--text)">' + activeSelected + '</span></h4>';
  html += '<div class="hint" style="margin:2px 0 0">' + selectedExpenses.length + ' item(s) &middot; Day Total: <b style="color:var(--gold)">' + selectedTotal.toFixed(2) + ' EGP</b></div></div>';
  html += '<button class="xbtn" onclick="jumpExpenseToToday()">Jump to Today</button>';
  html += '</div>';

  if(selectedExpenses.length > 0){
    html += '<div class="exp-item-list">';
    selectedExpenses.forEach(function(exp, i){
      const cat = EXPENSE_CATEGORIES[exp.category] || EXPENSE_CATEGORIES.other;
      html += '<div class="exp-item">';
      html += '<span class="exp-cat-icon" style="background:' + cat.color + '22;color:' + cat.color + '">' + cat.icon + '</span>';
      html += '<div class="exp-item-info">';
      html += '<div class="exp-note">' + esc(exp.note || 'No note') + '</div>';
      html += '<div class="exp-cat-badge" style="color:' + cat.color + '">' + cat.label + '</div>';
      html += '</div>';
      html += '<span class="exp-amount">' + (exp.amount || 0).toFixed(2) + ' EGP</span>';
      html += '<button class="exp-delete" title="Delete record" onclick="deleteExpense(\'' + activeSelected + '\', ' + i + ')">×</button>';
      html += '</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="hint" style="padding:12px;background:var(--card);border:1px dashed var(--line);border-radius:6px;text-align:center;margin:10px 0">';
    html += 'No expenses logged for this day yet. Record what you spent or log a zero-spend day.</div>';
  }

  /* Quick Log row for selected day */
  html += '<div class="exp-quick-add-box">';
  html += '<div class="exp-quick-title">+ Quick Log for ' + activeSelected + ':</div>';
  html += '<div class="exp-quick-fields">';
  html += '<input type="number" id="quickExpAmount" placeholder="Amount (EGP)" min="0" step="0.01" style="max-width:130px">';
  html += '<select id="quickExpCategory" style="max-width:160px">';
  Object.keys(EXPENSE_CATEGORIES).forEach(function(ck){
    html += '<option value="' + ck + '">' + EXPENSE_CATEGORIES[ck].icon + ' ' + EXPENSE_CATEGORIES[ck].label + '</option>';
  });
  html += '</select>';
  html += '<input type="text" id="quickExpNote" placeholder="What did you spend on? (e.g. food, transport, bills)" style="flex:1">';
  html += '<button class="btn" style="padding:6px 14px;white-space:nowrap" onclick="addQuickExpense(\'' + activeSelected + '\')">Log Expense</button>';
  html += '</div>';
  html += '</div>';

  html += '</div>';

  el.innerHTML = html;
}

function addQuickExpense(dateKey){
  const amtEl = document.getElementById('quickExpAmount');
  const noteEl = document.getElementById('quickExpNote');
  const catEl = document.getElementById('quickExpCategory');

  if(!amtEl || !noteEl || !catEl) return;

  const amount = parseFloat(amtEl.value);
  const note = (noteEl.value || '').trim();
  const category = catEl.value || 'other';

  if(isNaN(amount) || amount < 0 || !note){
    alert('Please enter an amount and note (or note "Zero spend").');
    return;
  }

  if(!S.expenses) S.expenses = {};
  if(!S.expenses[dateKey]) S.expenses[dateKey] = [];

  S.expenses[dateKey].push({ amount: amount, note: note, category: category });
  addXP(2, 'money', false, 'expense');
  log('MONEY', 'Logged <b>' + amount.toFixed(2) + ' EGP</b> on ' + dateKey + ' (' + esc(note) + '). Awareness builds control.');
  save();
  renderAll();
}

function addExpense(){
  const dateEl = document.getElementById('expenseDate');
  const amtEl = document.getElementById('expenseAmount');
  const noteEl = document.getElementById('expenseNote');
  const catEl = document.getElementById('expenseCategory');

  const date = (dateEl && dateEl.value) || expSelectedDate || dayKey();
  const amount = amtEl ? parseFloat(amtEl.value) : 0;
  const note = (noteEl && noteEl.value || '').trim();
  const category = (catEl && catEl.value) || 'other';

  if(!date || isNaN(amount) || amount < 0 || !note){
    alert('Please fill in date, amount, and note.');
    return;
  }

  if(!S.expenses) S.expenses = {};
  if(!S.expenses[date]) S.expenses[date] = [];

  S.expenses[date].push({ amount: amount, note: note, category: category });
  if(amtEl) amtEl.value = '';
  if(noteEl) noteEl.value = '';

  addXP(2, 'money', false, 'expense');
  log('MONEY', 'Logged expense: <b>' + amount.toFixed(2) + ' EGP</b> on ' + date + ' (' + esc(note) + ').');
  save();
  renderAll();
}

function deleteExpense(dateKey, index){
  if(!S.expenses || !S.expenses[dateKey]) return;
  const removed = S.expenses[dateKey][index];
  S.expenses[dateKey].splice(index, 1);
  if(S.expenses[dateKey].length === 0){
    delete S.expenses[dateKey];
  }
  log('MONEY', 'Removed expense entry' + (removed ? ': ' + removed.amount + ' EGP' : '') + '.');
  save();
  renderAll();
}

function drawExpenseSummary(){
  const el = document.getElementById('expenseSummary');
  if(!el) return;

  initExpenseNav();

  const now = new Date();
  const viewPrefix = expNavYear + '-' + String(expNavMonth + 1).padStart(2, '0');
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let viewMonthTotal = 0;
  let allTimeTotal = 0;
  let zeroSpendDays = 0;
  let loggedDaysInView = 0;
  const categoryTotals = {};

  Object.keys(S.expenses || {}).forEach(function(dateKey){
    const list = S.expenses[dateKey] || [];
    let dayTotal = 0;
    list.forEach(function(exp){
      const amt = exp.amount || 0;
      dayTotal += amt;
      allTimeTotal += amt;
      if(dateKey.startsWith(viewPrefix)){
        viewMonthTotal += amt;
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
      }
    });

    if(dateKey.startsWith(viewPrefix)){
      loggedDaysInView++;
      if(dayTotal <= 0.05){
        zeroSpendDays++;
      }
    }
  });

  const daysCount = new Date(expNavYear, expNavMonth + 1, 0).getDate();
  const dailyAvg = loggedDaysInView > 0 ? (viewMonthTotal / loggedDaysInView) : 0;

  let html = '<div class="exp-summary-grid">';
  html += '<div class="exp-summary-card">';
  html += '<div class="exp-summary-label">' + monthNames[expNavMonth] + ' ' + expNavYear + '</div>';
  html += '<div class="exp-summary-value" style="color:var(--gold)">' + viewMonthTotal.toFixed(2) + ' EGP</div>';
  html += '<div class="hint">' + loggedDaysInView + ' / ' + daysCount + ' days tracked</div>';
  html += '</div>';

  html += '<div class="exp-summary-card">';
  html += '<div class="exp-summary-label">All-Time Spend</div>';
  html += '<div class="exp-summary-value">' + allTimeTotal.toFixed(2) + ' EGP</div>';
  html += '<div class="hint">' + Object.keys(S.expenses || {}).length + ' total logged days</div>';
  html += '</div>';

  html += '<div class="exp-summary-card">';
  html += '<div class="exp-summary-label">Zero-Spend Days</div>';
  html += '<div class="exp-summary-value" style="color:var(--green)">' + zeroSpendDays + ' Days</div>';
  html += '<div class="hint">Discipline anchors</div>';
  html += '</div>';

  html += '<div class="exp-summary-card">';
  html += '<div class="exp-summary-label">Daily Average</div>';
  html += '<div class="exp-summary-value">' + dailyAvg.toFixed(2) + ' EGP</div>';
  html += '<div class="hint">Per logged day</div>';
  html += '</div>';
  html += '</div>';

  /* Category breakdown for the active month */
  const catKeys = Object.keys(categoryTotals).sort(function(a, b){
    return categoryTotals[b] - categoryTotals[a];
  });

  if(catKeys.length > 0){
    html += '<div class="st" style="margin-top:20px"><h2>Spending Breakdown (' + monthNames[expNavMonth] + ')</h2><span class="tag">BY CATEGORY</span></div>';
    html += '<div class="exp-cat-list">';
    catKeys.forEach(function(ck){
      const cat = EXPENSE_CATEGORIES[ck] || EXPENSE_CATEGORIES.other;
      const amt = categoryTotals[ck] || 0;
      const pct = viewMonthTotal > 0 ? ((amt / viewMonthTotal) * 100).toFixed(1) : 0;
      html += '<div class="exp-cat-item">';
      html += '<span class="exp-cat-icon" style="background:' + cat.color + '22;color:' + cat.color + '">' + cat.icon + '</span>';
      html += '<div class="exp-cat-main">';
      html += '<div class="exp-cat-label-row"><span>' + cat.label + '</span><b>' + amt.toFixed(2) + ' EGP (' + pct + '%)</b></div>';
      html += '<div class="bar thin" style="margin:4px 0 0"><i style="width:' + pct + '%;background:' + cat.color + '"></i></div>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}

function drawExpenseSearchLedger(){
  let el = document.getElementById('expenseSearchLedger');
  if(!el){
    // If not found in index.html, try to inject before summary
    const parent = document.getElementById('expenses');
    if(parent){
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.innerHTML = '<div class="st"><h2>Financial Memory Ledger &amp; Search</h2><span class="tag">سجل الذاكرة المالية</span></div>'
                      + '<div class="hint">ابحث في أي وقت عن أي مصروف سابق نسيته (مثال: كشري, سفر, مواصلات, قهوة, كورة)، واسترجع تاريخه وقيمته بدقة.</div>'
                      + '<div id="expenseSearchLedger"></div>';
      parent.appendChild(panel);
      el = document.getElementById('expenseSearchLedger');
    }
  }
  if(!el) return;

  const query = (expSearchQuery || '').toLowerCase();
  const filter = expFilterCat || 'all';

  // Gather and flatten all historical records
  const allEntries = [];
  if(S && S.expenses){
    Object.keys(S.expenses).forEach(function(dateKey){
      const list = S.expenses[dateKey] || [];
      list.forEach(function(e, idx){
        allEntries.push({
          date: dateKey,
          index: idx,
          amount: e.amount || 0,
          note: e.note || '',
          category: e.category || 'other'
        });
      });
    });
  }

  // Sort descending by date
  allEntries.sort(function(a, b){
    if(a.date !== b.date) return b.date.localeCompare(a.date);
    return b.amount - a.amount;
  });

  // Filter
  const filtered = allEntries.filter(function(item){
    if(filter !== 'all' && item.category !== filter) return false;
    if(!query) return true;
    const noteLower = item.note.toLowerCase();
    const catObj = EXPENSE_CATEGORIES[item.category] || EXPENSE_CATEGORIES.other;
    const catLabelLower = catObj.label.toLowerCase();
    return noteLower.indexOf(query) !== -1 || catLabelLower.indexOf(query) !== -1 || item.date.indexOf(query) !== -1;
  });

  const totalFiltered = filtered.reduce(function(sum, x){ return sum + x.amount; }, 0);

  let html = '<div class="exp-memory-card">';
  html += '<div class="exp-search-bar-row">';
  html += '<div class="exp-search-input-wrap">';
  html += '<span class="exp-search-icon">🔍</span>';
  html += '<input type="text" id="expSearchInput" class="exp-search-input" value="' + esc(expSearchQuery) + '" '
        + 'placeholder="ابحث في ذاكرة المصروفات (مثال: كشري, سفر, مواصلات, كورة, حلاقة, قهوة)..." '
        + 'oninput="onExpenseSearch(this.value)">';
  if(expSearchQuery){
    html += '<button class="exp-clear-search" onclick="onExpenseSearch(\'\')">✕</button>';
  }
  html += '</div>';
  html += '</div>';

  /* Category pills */
  html += '<div class="exp-cat-pills">';
  html += '<button class="exp-pill' + (filter === 'all' ? ' active' : '') + '" onclick="setExpenseFilterCat(\'all\')">الكل (All)</button>';
  Object.keys(EXPENSE_CATEGORIES).forEach(function(ck){
    const c = EXPENSE_CATEGORIES[ck];
    const isAct = (filter === ck);
    html += '<button class="exp-pill' + (isAct ? ' active' : '') + '" '
          + 'style="' + (isAct ? 'background:' + c.color + ';border-color:' + c.color + ';color:#000' : '') + '" '
          + 'onclick="setExpenseFilterCat(\'' + ck + '\')">'
          + c.icon + ' ' + c.label + '</button>';
  });
  html += '</div>';

  /* Search results stats banner */
  html += '<div class="exp-results-stat-bar">';
  html += '<span>تم العثور على <b>' + filtered.length + '</b> مصروف مسجل</span>';
  html += '<span class="exp-stat-sum">إجمالي المبلغ: <b style="color:var(--gold)">' + totalFiltered.toFixed(2) + ' EGP</b></span>';
  html += '</div>';

  /* Results Table */
  if(filtered.length > 0){
    html += '<div class="exp-table-scroll">';
    html += '<table class="exp-ledger-table">';
    html += '<thead><tr>';
    html += '<th>التاريخ (Date)</th>';
    html += '<th>القسم (Category)</th>';
    html += '<th>البيان والملاحظات (Note)</th>';
    html += '<th style="text-align:right">المبلغ (Amount)</th>';
    html += '<th style="text-align:center">إجراء</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    const weekdayNamesAr = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

    filtered.forEach(function(item){
      const cat = EXPENSE_CATEGORIES[item.category] || EXPENSE_CATEGORIES.other;
      const dObj = new Date(item.date);
      const dowAr = weekdayNamesAr[dObj.getDay()] || '';

      html += '<tr>';
      html += '<td class="exp-td-date"><span class="exp-td-dnum">' + item.date + '</span><span class="exp-td-dow">' + dowAr + '</span></td>';
      html += '<td><span class="exp-td-cat" style="color:' + cat.color + '">' + cat.icon + ' ' + cat.label + '</span></td>';
      html += '<td class="exp-td-note">' + esc(item.note) + '</td>';
      html += '<td class="exp-td-amount" style="text-align:right">' + item.amount.toFixed(2) + ' EGP</td>';
      html += '<td style="text-align:center"><button class="exp-delete" title="Delete record" onclick="deleteExpense(\'' + item.date + '\', ' + item.index + ')">×</button></td>';
      html += '</tr>';
    });

    html += '</tbody></table>';
    html += '</div>';
  } else {
    html += '<div class="hint" style="text-align:center;padding:24px;border:1px dashed var(--line);border-radius:6px;margin-top:10px">';
    html += 'لم يتم العثور على أي مصروف يطابق كلمة البحث "' + esc(expSearchQuery) + '". جرب كلمة أخرى أو اختر قسماً مختلفاً.</div>';
  }

  html += '</div>';

  el.innerHTML = html;
}
