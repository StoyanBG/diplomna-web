document.getElementById('complaintForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    const subject = document.getElementById('subject').value; // Get the subject value
    const message = document.getElementById('message').value; // Get the message value

    fetch('/send-message', { // Updated to /api/send-message for Vercel API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials for authentication
        body: JSON.stringify({ subject, message }) // Send subject and message as JSON
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(errorMessage); // Capture any error message
            });
        }
        return response.text(); // Parse response as text
    })
    .then(data => {
        document.getElementById('responseMessage').textContent = 'Complaint sent successfully!'; // Display success message
        document.getElementById('complaintForm').reset(); // Reset form fields
    })
    .catch(error => {
        document.getElementById('responseMessage').textContent = 'Error: ' + error.message; // Display error message
    });
});

// Check authentication status when main page button is clicked
document.getElementById('main-page-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    fetch('/check-auth') // Updated to /api/check-auth for consistent API routing
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check authentication'); // Throw an error if response not ok
            }
            return response.json();
        })
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
            window.location.href = '../login.html'; // Redirect to login on error
        });
});
