document.getElementById('complaintForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    const subject = document.getElementById('subject').value; // Get the subject value
    const message = document.getElementById('message').value; // Get the message value

    fetch('/api/send-message', { // Update to /api/send-message to match your Vercel API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials for authentication
        body: JSON.stringify({ subject, message }) // Send subject and message as JSON
    })
    .then(response => response.text()) // Parse response as text
    .then(data => {
        document.getElementById('responseMessage').textContent = data; // Display response message
        document.getElementById('complaintForm').reset(); // Reset form fields
    })
    .catch(error => {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message; // Display error message
    });
});

// Check authentication status when main page button is clicked
document.getElementById('main-page-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    fetch('/api/check-auth') // Update to /api/check-auth for consistent API routing
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                // Redirect to success.html if authenticated
                window.location.href = '../success.html';
            } else {
                // Redirect to login.html if not authenticated
                window.location.href = '../login.html';
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error); // Log any errors
            // Handle error, maybe redirect to login or show a message
            window.location.href = '../login.html';
        });
});
