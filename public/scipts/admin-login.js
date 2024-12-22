const adminLoginForm = document.getElementById('admin-login-form');

adminLoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

  try {
    const response = await fetch('/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Store the admin token and redirect to an admin dashboard or admin panel
      sessionStorage.setItem('adminToken', result.token);
      window.location.href = '../admin-dashboard1.html';
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Admin login error:', error);
  }
});
