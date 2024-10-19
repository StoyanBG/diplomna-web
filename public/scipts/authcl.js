const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        window.location.href = '../login.html';
        return;
}