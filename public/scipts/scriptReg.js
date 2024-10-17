document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission
  const formData = new FormData(this);
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Check if passwords match
  if (password !== confirmPassword) {
      alert('Паролите не съвпадат'); // Show alert if passwords do not match
      return;
  }

  fetch('/register', { // Update to /api/register to match your Vercel API
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          password: password
      })
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(data => {
              throw new Error(data.error); // Throw an error for non-ok responses
          });
      }
      // Redirect to success.html if registration is successful
      window.location.href = '../allLines.html';
  })
  .catch(error => {
      alert(error.message); // Show error message to the user
  });
});
