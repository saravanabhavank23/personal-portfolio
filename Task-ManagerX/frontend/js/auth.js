// ===== SIGNUP =====
async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage('signupMessage', data.message || 'Signup failed.', true);
      return;
    }

    showMessage('signupMessage', 'Account created! Please login.', false);
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';

    // Switch to login form after a short delay
    setTimeout(() => {
      document.getElementById('signupForm').classList.remove('active');
      document.getElementById('loginForm').classList.add('active');
    }, 1200);

  } catch (err) {
    showMessage('signupMessage', 'Server error. Please try again.', true);
    console.error(err);
  }
}

// ===== LOGIN =====
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMessage('loginMessage', data.message || 'Login failed.', true);
      return;
    }

    // Save token + name, then go to dashboard
    saveToken(data.token);
    localStorage.setItem('userName', data.name || data.user?.name || 'User');

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    showDashboard();

  } catch (err) {
    showMessage('loginMessage', 'Server error. Please try again.', true);
    console.error(err);
  }
}