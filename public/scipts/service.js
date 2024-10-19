document.getElementById('complaintForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
    const subject = document.getElementById('subject').value; // Get the subject value
    const message = document.getElementById('message').value; // Get the message value

    const token = sessionStorage.getItem('token'); // Retrieve the JWT token from sessionStorage

    // Check if the token exists
    if (!token) {
        alert('You must be logged in to submit a complaint. Redirecting to login page.');
        window.location.href = '../login.html'; // Redirect to login page if token does not exist
        return; // Exit the function
    }

    // Decode the token to get the user's information
    const userPayload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const responderName = userPayload.name; // Extract the responder's name from the token payload

    fetch('/send-message', { // Endpoint for sending the message
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token for authorization
        },
        body: JSON.stringify({ subject, message, responderName }) // Send subject, message, and responder name as JSON
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
