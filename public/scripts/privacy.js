function checkAuth(){
    const token = sessionStorage.getItem('token');

    if (!token) {
        // If token doesn't exist, redirect to login page
        alert("За да достъпите другата част от сайта трябва да сте влезли");
        window.location.href = '../login.html';
        
        return;
    }
}