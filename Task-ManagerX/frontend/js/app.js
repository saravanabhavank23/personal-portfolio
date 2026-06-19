// ===== CONFIG =====
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

// ===== TOKEN HELPERS =====
function saveToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  return localStorage.getItem('token');
}

function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
}

function isLoggedIn() {
  return !!getToken();
}

// ===== UI HELPERS =====
function showMessage(elementId, text, isError = false) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = 'message ' + (isError ? 'error' : 'success');
  setTimeout(() => {
    el.textContent = '';
    el.className = 'message';
  }, 4000);
}

function toggleForm(e) {
  e.preventDefault();
  document.getElementById('signupForm').classList.toggle('active');
  document.getElementById('loginForm').classList.toggle('active');
}

function showDashboard() {
  document.getElementById('authContainer').style.display = 'none';
  document.getElementById('dashboardContainer').style.display = 'block';
  const name = localStorage.getItem('userName') || 'User';
  document.getElementById('userName').textContent = name;
  loadTasks();
}

function showAuthPage() {
  document.getElementById('authContainer').style.display = 'flex';
  document.getElementById('dashboardContainer').style.display = 'none';
}

function handleLogout() {
  clearToken();
  showAuthPage();
}

// ===== ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showAuthPage();
  }
});

// ===== MODAL HELPERS =====
function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
}

function openEditModal(task) {
  document.getElementById('editTaskTitle').value = task.title;
  document.getElementById('editTaskDescription').value = task.description || '';
  document.getElementById('editTaskStatus').value = task.status || 'pending';
  document.getElementById('editTaskPriority').value = task.priority || 'medium';
  document.getElementById('editTaskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
  document.getElementById('editModal').dataset.taskId = task._id;
  document.getElementById('editModal').classList.add('active');
}