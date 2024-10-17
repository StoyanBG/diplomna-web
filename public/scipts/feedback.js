function sendFeedback() {
    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;

    // Validate email and message
    if (!userEmail || !message) {
        alert('Please provide both an email and a message.');
        return;
    }

    const subject = encodeURIComponent('Web App Feedback');
    const body = encodeURIComponent(`From: ${userEmail}\n\n${message}`);
    
    // Construct the Gmail URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=stoyankanev01@gmail.com&su=${subject}&body=${body}`;
    
    // Open the Gmail URL in a new tab
    window.open(gmailUrl, '_blank');
}

// Check authentication status on main page button click
document.getElementById('main-page-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    // Check authentication status
    fetch('/check-auth') // Change to /api/check-auth to match your Vercel API
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check authentication');
            }
            return response.json();
        })
        .then(data => {
            if (data.isAuthenticated) {
                // Redirect to cl.html if authenticated
                window.location.href = '../cl.html';
            } else {
                // Redirect to login.html if not authenticated
                window.location.href = '../login.html';
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            // Handle error, maybe redirect to login or show a message
            window.location.href = '../login.html';
        });
});
