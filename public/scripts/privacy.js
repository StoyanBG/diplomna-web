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