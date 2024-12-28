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
function checkAuthAllLines(){
    const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = 'login.html';
        return;
        
    }
    else{
        window.location.href = 'all-lines.html';
        return;
    }    
}
function checkAuthChooseLines(){
    const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = 'login.html';
        return;
    }
    else{
        window.location.href = 'choose-lines.html';
        return;
    }  
}
function checkAuthFavouriteLines(){
    const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = 'login.html';
        return;
    }
    else{
        window.location.href = 'favourite-lines.html';
        return;
    }  
}
function checkAuthService(){
    const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = 'login.html';
        return;
    }
    else{
        window.location.href = 'service.html';
        return;
    }  
}
function checkAuthComplaint(){
    const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = 'login.html';
        return;
    }
    else{
        window.location.href = 'complaint.html';
        return;
    }  
}

