document.getElementById('send-news-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
  
    // Get the admin token from sessionStorage
    const token = sessionStorage.getItem('adminToken');
  
    try {
      const response = await fetch('/send-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
        },
        body: JSON.stringify({ title, content })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('News sent successfully!');
        document.getElementById('send-news-form').reset();
      } else {
        alert('Failed to send news: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending news:', error);
      alert('Error sending news. Please try again.');
    }
  });