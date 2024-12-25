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
      // Store the admin token in sessionStorage
      sessionStorage.setItem('adminToken', result.token);

      // Redirect to the admin dashboard or admin panel
      window.location.href = '../admin-dashboard.html';
    } else {
      // Show error message if login fails
      alert(result.error);
    }
  } catch (error) {
    console.error('Грешка при влизането:', error);
  }
});
