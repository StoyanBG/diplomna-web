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
const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        window.location.href = '../login.html';
        return;
}
