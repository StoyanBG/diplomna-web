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
  
    fetch('/api/register', { // Updated to /api/register for Vercel deployment
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
        return response.json(); // Parse JSON response
    })
    .then(data => {
        // User registered successfully, now you may choose to auto-login
        alert(data.message); // Optionally show success message
        
        // Redirect to allLines.html after successful registration
        window.location.href = '../allLines.html';
    })
    .catch(error => {
        alert(error.message); // Show error message to the user
    });
});
