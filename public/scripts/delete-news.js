document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('adminToken');
    const newsListElement = document.getElementById('news-list');
  
    if (!token) {
      alert('You must be logged in as an admin to view this page.');
      window.location.href = '/admin-login.html'; // Redirect to login page if not logged in
      return;
    }
  
    try {
      const response = await fetch('/get-news', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.news && data.news.length > 0) {
          data.news.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
              <div>${news.title}</div>
              <button class="delete-btn" data-id="${news.id}">Изтриване</button>
            `;
            newsListElement.appendChild(newsItem);
          });
  
          // Add event listeners for delete buttons
          const deleteButtons = newsListElement.querySelectorAll('.delete-btn');
          deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
              const newsId = button.getAttribute('data-id');
              await deleteNews(newsId);
            });
          });
        } else {
          newsListElement.innerHTML = '<p>No news available to delete.</p>';
        }
      } else {
        alert('Failed to fetch news: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Error fetching news. Please try again.');
    }
  });
  
  async function deleteNews(newsId) {
    const token = sessionStorage.getItem('adminToken');
  
    try {
      const response = await fetch(`/delete-news/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('News deleted successfully!');
        window.location.reload(); // Refresh the page to update the list
      } else {
        alert('Failed to delete news: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Error deleting news. Please try again.');
    }
  }