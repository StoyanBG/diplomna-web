// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token') || sessionStorage.getItem('token'); // Retrieve from sessionStorage

if (token) {
    // Store the token in sessionStorage for future requests (if it was from the URL)
    sessionStorage.setItem('token', token);
}

// Function to fetch selected lines for the current user
function fetchSelectedLines() {
    fetch('/selected-lines', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch selected lines');
        }
        return response.json(); // Parse the response as JSON
    })
    .then(lineIds => {
        // Ensure that lineIds is an array
        if (Array.isArray(lineIds)) {
            // Display selected lines as buttons
            const lineButtonsContainer = document.getElementById('lineButtons');
            lineButtonsContainer.innerHTML = ''; // Clear any existing buttons
            
            lineIds.forEach(line => {
                const buttonDiv = document.createElement('div');
                buttonDiv.className = 'button-div';

                const aTag = document.createElement('a');
                aTag.style.color = 'red';
                aTag.href = `lines/liniq${line}.html`; // Link to the line page

                const button = document.createElement('button');
                button.className = 'btn btn-warning';

                const image = document.createElement('img');
                image.src = `lines/img/${line}.jpg`; // Image source for the line

                const h5 = document.createElement('h5');
                h5.textContent = `линия ${line}`; // Text for the button

                // Append elements
                button.appendChild(image);
                button.appendChild(h5);
                aTag.appendChild(button);
                buttonDiv.appendChild(aTag);
                lineButtonsContainer.appendChild(buttonDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching selected lines:', error);
        alert('Could not load selected lines. Please try again later.'); // User-friendly message
    });
}

// Call the function to fetch selected lines
fetchSelectedLines();

// Check authentication status on main page button click
document.getElementById('main-page-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor click behavior

    // Check authentication status
    fetch('/check-auth', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request headers
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to check authentication');
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
        alert('Authentication check failed. Redirecting to login.'); // User-friendly message
        window.location.href = '../login.html'; // Redirect to login page on error
    });
});
