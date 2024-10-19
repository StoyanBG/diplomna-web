document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);

    // Fetch login endpoint
    fetch('/login', { // Ensure the endpoint is correct for your setup
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
        // Store the JWT token in sessionStorage for session-scoped storage
        sessionStorage.setItem('token', data.token);

        // Redirect to fl.html after successful login
        window.location.href = '../fl.html';
    })
    .catch(error => {
        alert(error.message); // Display an error message to the user
    });
});

