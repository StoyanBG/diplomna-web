function saveChoice() { 
    // Get all the relevant checkboxes by their IDs
    const checkboxes = [
        document.getElementById("l1"),
        document.getElementById("l7"),
        document.getElementById("l9"),
        document.getElementById("l11"),
        document.getElementById("l16"),
        document.getElementById("l27"),
        document.getElementById("l36")
    ];

    const chosenLines = [];
    
    // Loop through checkboxes, adding values of checked ones to the chosenLines array
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            chosenLines.push(checkbox.value);
        }
    });
  
    // Retrieve the authentication token from sessionStorage

    const token = sessionStorage.getItem('token');

    
    // Check if the user has selected any lines
    if (chosenLines.length === 0) {
        alert('Please select at least one line.');
        return; // Exit the function if no lines are selected
    }
  
    // Send a POST request to save the user's selected lines
    fetch('/save-choice', { // Added /api/ prefix for Vercel API consistency
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token for authentication
        },
        body: JSON.stringify({ lineIds: chosenLines }) // Send the selected line IDs as JSON
    })
    .then(response => {
        if (response.ok) {
            // If successful, redirect to fl.html
            window.location.href = '../fl.html'; // Adjusted the path to work with Vercel
        }

        else if ((!token)) {
            alert('You must be logged in to choose a favourite line. Redirecting to login page.');
            window.location.href = '../login.html'; // Adjust this based on your app structure
        }
         else {
            window.location.href = '../login.html';
            throw new Error('There was a mistake saving your choices');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an issue saving your choices. Please try again.'); // User-friendly error message
    });
}
