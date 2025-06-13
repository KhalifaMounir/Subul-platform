function showLoginModal() {
  const loginModal = document.getElementById('login-modal');
  if (!loginModal) {
    console.error('Login modal not found');
    return;
  }
  console.log('Showing login modal at', new Date().toLocaleString());
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  const loginModal = document.getElementById('login-modal');
  if (!loginModal) {
    console.error('Login modal not found');
    return;
  }
  console.log('Closing login modal at', new Date().toLocaleString());
  loginModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === 'demo@subol.com' && password === 'demo123') {
    console.log('Login successful, redirecting to / at', new Date().toLocaleString());
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/';
  } else {
    console.log('Login failed: Invalid credentials at', new Date().toLocaleString());
    alert('البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.');
  }
});

document.getElementById('login-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    closeLoginModal();
  }
});