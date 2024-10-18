document.getElementById('main-page-button').addEventListener('click', function(event) { 
    event.preventDefault(); // Prevent default behavior of the button click

    // Fetch the user's authentication status from the server
    fetch('/check-auth') // Updated path for API consistency
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to check authentication status');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            if (data.isAuthenticated) {
                // If the user is authenticated, redirect to the cl.html page
                window.location.href = '../cl.html'; // Adjusted the path for Vercel deployment
            } else {
                // If not authenticated, redirect to the login.html page
                window.location.href = '../login.html';
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            // On error, redirect to the login page as a fallback
            window.location.href = '../login.html';
        });
});
