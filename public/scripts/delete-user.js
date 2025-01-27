const deleteUserForm = document.getElementById('delete-user-form');
const userList = document.getElementById('user-list');

deleteUserForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const userId = document.getElementById('user-id').value;

  try {
    const response = await fetch('/delete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      alert('Успешно изтрит потребител');
      fetchUserList();
    } else {
      alert('Неуспешно изтриване на потребител');
    }
  } catch (error) {
    console.error('Имаше грешка при изтриване на потребителя:', error);
  }
});

// Fetch and display list of users
async function fetchUserList() {
  try {
    const response = await fetch('/users', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
      }
    });

    const users = await response.json();

    if (response.ok) {
      userList.innerHTML = users.map(user => `<p>${user.id}: ${user.name} (${user.email})</p>`).join('');
    } else {
      alert('Неуспешно извличане на новини');
    }
  } catch (error) {
    console.error('Грешка при извличане на новини:', error);
  }
}

fetchUserList();
