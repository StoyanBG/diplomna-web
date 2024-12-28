function sendFeedback() {

    const userEmail = document.getElementById('userEmail').value;
    const message = document.getElementById('message').value;

    // Validate email and message
    if (!userEmail || !message) {
        alert('Моля дайте е-майл и съобщение');
        return;
    }

    const subject = encodeURIComponent('обратна връзка за Web-приложение');
    const body = encodeURIComponent(`От: ${userEmail}\n\n${message}`);
    
    // Construct the Gmail URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=stoyankanev01@gmail.com&su=${subject}&body=${body}`;
    
    // Open the Gmail URL in a new tab
    window.open(gmailUrl, '_blank');
}
function checkAuth(page) {
    const token = sessionStorage.getItem('token');

    if (token) {
        window.location.href = page;
    } else {
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = 'login.html';
    }
}

function checkAuthAllLines() {
    checkAuth('all-lines.html');
}

function checkAuthChooseLines() {
    checkAuth('choose-lines.html');
}

function checkAuthFavouriteLines() {
    checkAuth('favourite-lines.html');
}

function checkAuthService() {
    checkAuth('service.html');
}

function checkAuthComplaint() {
    checkAuth('complaint.html');
}

