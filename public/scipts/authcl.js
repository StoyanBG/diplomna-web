document.getElementById('main-page-button').addEventListener('click', function(event) { 
    event.preventDefault(); // Prevent the default anchor click behavior

    // Check authentication status
    fetch('/check-auth') // Ensure the path corresponds to your API structure
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
