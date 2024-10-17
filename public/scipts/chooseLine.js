function saveChoice() { 
  // Get all checked checkboxes
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
  
  // Check if each checkbox is checked and add its value to the chosenLines array
  checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
          chosenLines.push(checkbox.value);
      }
  });

  // Send a POST request to save the user's choices
  fetch('/api/save-choice', { // Change to /api/save-choice to match your Vercel API
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lineIds: chosenLines })
  })
  .then(response => {
      if (response.ok) {
          // If the response is successful, redirect to fl.html
          window.location.href = '../fl.html';
      } else {
          // Handle errors
          throw new Error('Failed to save choices');
      }
  })
  .catch(error => {
      console.error('Error:', error); // Log any errors
  });
}
