document.addEventListener('DOMContentLoaded', async function() {
    const newsList = document.getElementById('novList');
    
    try {
        // Fetch the news data from the server
        const response = await fetch('/get-news', {
            method: 'GET',
        });
  
        const data = await response.json();
  
        if (response.ok) {
            if (data && data.news && data.news.length > 0) {
                // Loop through the news data and display it
                data.news.forEach(newsItem => {
                    // Generate HTML for each news item
                    const listItem = document.createElement('li');
                    listItem.classList.add('news-item');
                    listItem.innerHTML = `
                    
                        <h3>${newsItem.title}</h3>
                        <p>${newsItem.content}</p>
                        <small>Публикувано на: ${new Date(newsItem.created_at).toLocaleDateString()}</small>
                    `;
                    newsList.appendChild(listItem);
                });
            } else {
                newsList.innerHTML = '<li>Няма налични новини.</li>';
            }
        } else {
            alert('Неуспешно зареждане на новини: ' + data.message);
        }
    } catch (error) {
        console.error('Неуспешно извличане на новини:', error);
        alert('Неуспешно извличане на новини. Моля пробвайте пак.');
    }
});
