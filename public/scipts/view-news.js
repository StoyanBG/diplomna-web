document.addEventListener('DOMContentLoaded', async function() {
    const newsList = document.getElementById('novList');
    const token = localStorage.getItem('authToken'); // Get the JWT token from localStorage
  
    if (!token) {
      alert('You are not authorized. Please log in.');
      window.location.href = '/login.html'; // Redirect to login page if no token
      return;
    }
  
    try {
      // Fetch the news data from the server
      const response = await fetch('/get-news', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data && data.news && data.news.length > 0) {
          // Loop through the news data and display it
          data.news.forEach(newsItem => {
            const listItem = document.createElement('li');
            listItem.classList.add('news-item');
            listItem.innerHTML = `
              <h3>${newsItem.title}</h3>
              <p>${newsItem.content}</p>
              <small>Published on: ${new Date(newsItem.created_at).toLocaleDateString()}</small>
            `;
            newsList.appendChild(listItem);
          });
        } else {
          newsList.innerHTML = '<li>No news available.</li>';
        }
      } else {
        alert('Failed to load news: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Error fetching news. Please try again.');
    }
  });
  