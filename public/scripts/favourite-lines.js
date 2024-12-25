// Retrieve the token from sessionStorage
const token = sessionStorage.getItem('token');

if (!token) {
    // If no token is found, redirect to login
    window.location.href = '../login.html'; // Adjust this based on your app structure
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
            throw new Error('Please login');
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

