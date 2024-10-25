function redirectToComplaintPage() {
    const token = sessionStorage.getItem('token');
    if (token) {
        window.location.href = '../cl.html';
    } else {
        window.location.href = '../login.html';
    }
}
