document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('adminToken');
    const newsListElement = document.getElementById('news-list');
  
    if (!token) {
      alert('Трябва да сте влезли. Преместване към стрницата за влизане');
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
          newsListElement.innerHTML = '<p>Няма новини за изтриване</p>';
        }
      } else {
        alert('Неуспешно извличане на новини: ' + data.message);
      }
    } catch (error) {
      console.error('Неуспешно извличане на новини:', error);
      alert('Неуспешно извличане на новини. Пробвайте пак.');
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
        alert('Успешно изтриване на новини!');
        window.location.reload(); // Refresh the page to update the list
      } else {
        alert('Неуспешно изтриване на новини! ' + data.message);
      }
    } catch (error) {
      console.error('Неуспешно изтриване на новини!:', error);
      alert('Неуспешно изтриване на новини!. Пробвайте пак.');
    }
  }