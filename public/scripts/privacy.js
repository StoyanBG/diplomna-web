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
