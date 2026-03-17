/* ===========================================
   MY CUTE TODOS — app.js
   =========================================== */

// ─── State ────────────────────────────────────
let todos = JSON.parse(localStorage.getItem('cute-todos') || '[]');

// ─── DOM Refs ─────────────────────────────────
const todoInput    = document.getElementById('todo-input');
const todoDate     = document.getElementById('todo-date');
const todoTime     = document.getElementById('todo-time');
const addBtn       = document.getElementById('add-btn');
const todoList     = document.getElementById('todo-list');
const emptyState   = document.getElementById('empty-state');
const progressText = document.getElementById('progress-text');
const allDoneBanner= document.getElementById('all-done-banner');
const statsFooter  = document.getElementById('stats-footer');
const statTotal    = document.getElementById('stat-total');
const statCompleted= document.getElementById('stat-completed');

// ─── Init ─────────────────────────────────────
render();

// ─── Event Listeners ──────────────────────────
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

// ─── Add Todo ─────────────────────────────────
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) {
    todoInput.classList.add('shake');
    todoInput.addEventListener('animationend', () => todoInput.classList.remove('shake'), { once: true });
    return;
  }

  const todo = {
    id: Date.now(),
    text,
    date: todoDate.value,
    time: todoTime.value,
    completed: false,
  };

  todos.unshift(todo);
  save();

  // Clear inputs
  todoInput.value = '';
  todoDate.value  = '';
  todoTime.value  = '';
  todoInput.focus();

  render();
}

// ─── Toggle Complete ──────────────────────────
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    save();
    render();
  }
}

// ─── Delete Todo ──────────────────────────────
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

// ─── Save to LocalStorage ─────────────────────
function save() {
  localStorage.setItem('cute-todos', JSON.stringify(todos));
}

// ─── Format Date ──────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Format Time ──────────────────────────────
function formatTime(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ─── Render ───────────────────────────────────
function render() {
  const total     = todos.length;
  const completed = todos.filter(t => t.completed).length;

  // Empty state
  emptyState.style.display = total === 0 ? 'flex' : 'none';

  // Stats footer
  if (total > 0) {
    statsFooter.classList.remove('hidden');
    statTotal.textContent     = total;
    statCompleted.textContent = completed;
  } else {
    statsFooter.classList.add('hidden');
  }

  // Progress text
  if (total > 0) {
    progressText.textContent = `${completed} of ${total} completed! 🎉`;
  } else {
    progressText.textContent = '';
  }

  // All-done banner
  if (total > 0 && completed === total) {
    allDoneBanner.classList.remove('hidden');
    // Re-trigger animation
    allDoneBanner.style.animation = 'none';
    void allDoneBanner.offsetWidth;
    allDoneBanner.style.animation = '';
  } else {
    allDoneBanner.classList.add('hidden');
  }

  // Build list
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const dateDisplay = formatDate(todo.date);
    const timeDisplay = formatTime(todo.time);

    const metaHtml = (dateDisplay || timeDisplay) ? `
      <div class="todo-meta">
        ${dateDisplay ? `<span>📅 ${dateDisplay}</span>` : ''}
        ${timeDisplay ? `<span>🕐 ${timeDisplay}</span>` : ''}
      </div>
    ` : '';

    li.innerHTML = `
      <button class="todo-checkbox" aria-label="Toggle complete" title="Mark complete">
        ${todo.completed ? '✓' : ''}
      </button>
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        ${metaHtml}
      </div>
      <button class="delete-btn" aria-label="Delete todo" title="Delete">✕</button>
    `;

    li.querySelector('.todo-checkbox').addEventListener('click', () => toggleTodo(todo.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });
}

// ─── Escape HTML ──────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Shake animation (CSS injected) ───────────
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  .shake { animation: shake 0.4s ease; }
`;
document.head.appendChild(style);