document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);

    fetch('/login', { // Updated to /api/login for your Vercel deployment
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                // Redirect to registration.html if user is not found
                window.location.href = '../registration.html';
                return;
            }
            return response.json().then(data => {
                throw new Error(data.error); // Throw an error if the login failed
            });
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        // Use sessionStorage for session-scoped storage instead of localStorage
        sessionStorage.setItem('token', data.token);

        // Redirect to fl.html (Avoid passing token in query parameters for security reasons)
        window.location.href = '../fl.html';
    })
    .catch(error => {
        alert(error.message); // Display an error message to the user
    });
});
