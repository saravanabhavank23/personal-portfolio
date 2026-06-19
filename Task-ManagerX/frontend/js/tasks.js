// ===== LOAD ALL TASKS =====
async function loadTasks() {
  const listEl = document.getElementById('tasksList');
  listEl.innerHTML = '<div class="loading">Loading your tasks...</div>';

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (res.status === 401) {
      // token expired or invalid
      clearToken();
      showAuthPage();
      return;
    }

    const tasks = await res.json();
    renderTasks(tasks);

  } catch (err) {
    listEl.innerHTML = '<div class="empty-state">Failed to load tasks. Please refresh.</div>';
    console.error(err);
  }
}

// ===== RENDER TASKS TO DOM =====
function renderTasks(tasks) {
  const listEl = document.getElementById('tasksList');

  if (!tasks || tasks.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above! 🎯</div>';
    return;
  }

  const priorityIcons = { low: '🟢', medium: '🟡', high: '🔴' };

  listEl.innerHTML = tasks.map(task => `
    <div class="task-card status-${task.status}">
      <div class="task-card-header">
        <h3>${escapeHtml(task.title)}</h3>
        <span class="priority-badge">${priorityIcons[task.priority] || '🟡'}</span>
      </div>
      ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
      <div class="task-meta">
        <span class="status-badge status-${task.status}">${formatStatus(task.status)}</span>
        ${task.dueDate ? `<span class="due-date">📅 ${formatDate(task.dueDate)}</span>` : ''}
      </div>
      <div class="task-actions">
        <button class="btn btn-small btn-edit" onclick='openEditModal(${JSON.stringify(task).replace(/'/g, "&apos;")})'>Edit</button>
        <button class="btn btn-small btn-delete" onclick="handleDeleteTask('${task._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatStatus(status) {
  const map = { 'pending': 'Pending', 'in-progress': 'In Progress', 'completed': 'Completed' };
  return map[status] || status;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== CREATE TASK =====
async function handleCreateTask(e) {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value.trim();
  const description = document.getElementById('taskDescription').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, description, priority, dueDate, status: 'pending' })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage('createMessage', data.message || 'Failed to create task.', true);
      return;
    }

    showMessage('createMessage', 'Task added! ✅', false);
    e.target.reset();
    document.getElementById('taskPriority').value = 'medium';
    loadTasks();

  } catch (err) {
    showMessage('createMessage', 'Server error. Please try again.', true);
    console.error(err);
  }
}

// ===== UPDATE TASK =====
async function handleUpdateTask(e) {
  e.preventDefault();

  const taskId = document.getElementById('editModal').dataset.taskId;
  const title = document.getElementById('editTaskTitle').value.trim();
  const description = document.getElementById('editTaskDescription').value.trim();
  const status = document.getElementById('editTaskStatus').value;
  const priority = document.getElementById('editTaskPriority').value;
  const dueDate = document.getElementById('editTaskDueDate').value;

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ title, description, status, priority, dueDate })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage('editMessage', data.message || 'Failed to update task.', true);
      return;
    }

    closeEditModal();
    loadTasks();

  } catch (err) {
    showMessage('editMessage', 'Server error. Please try again.', true);
    console.error(err);
  }
}

// ===== DELETE TASK =====
async function handleDeleteTask(taskId) {
  if (!confirm('Delete this task? This cannot be undone.')) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || 'Failed to delete task.');
      return;
    }

    loadTasks();

  } catch (err) {
    alert('Server error. Please try again.');
    console.error(err);
  }
}