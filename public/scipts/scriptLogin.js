document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);

    fetch('/login', { // Update to /api/login to match your Vercel API
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
                // Redirect to registration.html if the endpoint is not found
                window.location.href = '../registration.html';
                return;
            }
            return response.json().then(data => {
                throw new Error(data.error); // Throw an error if response is not ok
            });
        }
        // If login is successful, store the token and redirect
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        // Store the token in session storage
        sessionStorage.setItem('token', data.token); // Store the token received from server

        // Redirect to fl.html
        window.location.href = '../fl.html'; 
    })
    .catch(error => {
        alert(error.message); // Show error message to the user
    });
});
