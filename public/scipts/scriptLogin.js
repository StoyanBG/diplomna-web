document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);

    fetch('/login', { // Update to /api/login if necessary for your Vercel deployment
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
        // Store the token in localStorage for persistence across browser sessions
        localStorage.setItem('token', data.token);

        // Redirect to the desired page after successful login
        window.location.href = '../fl.html'; 
    })
    .catch(error => {
        alert(error.message); // Display an error message to the user
    });
});
