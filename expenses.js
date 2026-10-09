/* =====================================================================
   SOLO LEVELING — MONEY EXPENSES CALENDAR
   Track daily spending to build financial awareness.
   ===================================================================== */

const EXPENSE_CATEGORIES = {
  food: { label: 'Food & Drinks', icon: '🍕', color: '#ff6b6b' },
  transport: { label: 'Transport', icon: '🚗', color: '#4ecdc4' },
  bills: { label: 'Bills & Utilities', icon: '💡', color: '#ffe66d' },
  shopping: { label: 'Shopping', icon: '🛍️', color: '#a29bfe' },
  health: { label: 'Health', icon: '💊', color: '#fd79a8' },
  education: { label: 'Education', icon: '📚', color: '#00b894' },
  entertainment: { label: 'Entertainment', icon: '🎮', color: '#e17055' },
  other: { label: 'Other', icon: '📦', color: '#b2bec3' }
};

function drawExpenses(){
  drawExpenseCalendar();
  drawExpenseSummary();
}

function drawExpenseCalendar(){
  const el = $('expenseCalendar');
  if(!el) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let html = '<div class="exp-cal-header"><h3>' + monthNames[month] + ' ' + year + '</h3></div>';
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
    const expenses = S.expenses[dateKey] || [];
    const total = expenses.reduce(function(sum, e){ return sum + e.amount; }, 0);
    const isToday = dateKey === dayKey();
    const hasExpenses = expenses.length > 0;

    html += '<div class="exp-cal-cell' + (isToday ? ' today' : '') + (hasExpenses ? ' has-expenses' : '') + '" onclick="selectExpenseDate(\'' + dateKey + '\')">';
    html += '<span class="exp-cal-day-num">' + day + '</span>';
    if(hasExpenses){
      html += '<span class="exp-cal-total">' + total.toFixed(0) + '</span>';
    }
    html += '</div>';
  }

  html += '</div>';

  /* selected date expenses */
  const selectedDate = $('expenseDate').value || dayKey();
  const selectedExpenses = S.expenses[selectedDate] || [];
  if(selectedExpenses.length > 0){
    html += '<div class="exp-day-detail"><h4>Expenses for ' + selectedDate + '</h4>';
    selectedExpenses.forEach(function(exp, i){
      const cat = EXPENSE_CATEGORIES[exp.category] || EXPENSE_CATEGORIES.other;
      html += '<div class="exp-item">';
      html += '<span class="exp-cat-icon" style="color:' + cat.color + '">' + cat.icon + '</span>';
      html += '<span class="exp-amount">' + exp.amount.toFixed(2) + ' EGP</span>';
      html += '<span class="exp-note">' + esc(exp.note) + '</span>';
      html += '<button class="exp-delete" onclick="deleteExpense(\'' + selectedDate + '\', ' + i + ')">×</button>';
      html += '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}

function selectExpenseDate(dateKey){
  document.getElementById('expenseDate').value = dateKey;
  drawExpenseCalendar();
}

function addExpense(){
  const date = document.getElementById('expenseDate').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const note = document.getElementById('expenseNote').value;
  const category = document.getElementById('expenseCategory').value;

  if(!date || isNaN(amount) || amount <= 0 || !note.trim()){
    alert('Please fill in all fields: date, amount, and note.');
    return;
  }

  if(!S.expenses) S.expenses = {};
  if(!S.expenses[date]) S.expenses[date] = [];

  S.expenses[date].push({ amount: amount, note: note.trim(), category: category });
  save();
  renderAll();
}

function deleteExpense(dateKey, index){
  if(!S.expenses || !S.expenses[dateKey]) return;
  S.expenses[dateKey].splice(index, 1);
  if(S.expenses[dateKey].length === 0) delete S.expenses[dateKey];
  save();
  renderAll();
}

function drawExpenseSummary(){
  const el = $('expenseSummary');
  if(!el) return;

  const now = new Date();
  const thisMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = lastMonth.getFullYear() + '-' + String(lastMonth.getMonth() + 1).padStart(2, '0');

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;
  const categoryTotals = {};

  Object.keys(S.expenses || {}).forEach(function(dateKey){
    const monthKey = dateKey.substring(0, 7);
    S.expenses[dateKey].forEach(function(exp){
      if(monthKey === thisMonth) thisMonthTotal += exp.amount;
      if(monthKey === lastMonthKey) lastMonthTotal += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
  });

  let html = '<div class="exp-summary-grid">';
  html += '<div class="exp-summary-card"><div class="exp-summary-label">This Month</div><div class="exp-summary-value">' + thisMonthTotal.toFixed(2) + ' EGP</div></div>';
  html += '<div class="exp-summary-card"><div class="exp-summary-label">Last Month</div><div class="exp-summary-value">' + lastMonthTotal.toFixed(2) + ' EGP</div></div>';
  html += '<div class="exp-summary-card"><div class="exp-summary-label">Daily Average</div><div class="exp-summary-value">' + (thisMonthTotal / now.getDate()).toFixed(2) + ' EGP</div></div>';
  html += '</div>';

  /* category breakdown */
  const catKeys = Object.keys(categoryTotals).sort(function(a, b){ return categoryTotals[b] - categoryTotals[a]; });
  if(catKeys.length > 0){
    html += '<h4>Category Breakdown (All Time)</h4><div class="exp-cat-list">';
    catKeys.forEach(function(catKey){
      const cat = EXPENSE_CATEGORIES[catKey] || EXPENSE_CATEGORIES.other;
      const pct = (categoryTotals[catKey] / Object.values(categoryTotals).reduce(function(a,b){return a+b;},0) * 100).toFixed(1);
      html += '<div class="exp-cat-item">';
      html += '<span class="exp-cat-icon" style="color:' + cat.color + '">' + cat.icon + '</span>';
      html += '<span class="exp-cat-label">' + cat.label + '</span>';
      html += '<span class="exp-cat-amount">' + categoryTotals[catKey].toFixed(2) + ' EGP</span>';
      html += '<span class="exp-cat-pct">' + pct + '%</span>';
      html += '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}
