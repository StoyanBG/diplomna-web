// Fetch and display complaints with responses on page load
document.addEventListener('DOMContentLoaded', fetchComplaints);

function fetchComplaints() {
    fetch('/get-complaints') // Updated API path for Vercel
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch complaints');
            }
            return response.json();
        })
        .then(complaints => {
            console.log('Fetched complaints:', complaints); // Log complaints for debugging
            const complaintsList = document.getElementById('complaintsList');
            complaintsList.innerHTML = ''; // Clear existing content
            
            complaints.forEach(complaint => {
                const responsesHtml = complaint.responses && Object.keys(complaint.responses).length > 0
                    ? Object.values(complaint.responses).map(res => 
                        `<p><strong>Отговор:</strong> ${res.response_message} (от ${res.responderName})</p>`).join('')
                    : '<p><strong>Отговор:</strong> Все още няма отговор</p>'; // Message if no responses

                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="complaint-item">
                        <p><strong>${complaint.subject}</strong> - ${complaint.message} (от ${complaint.sender})</p>
                        <div class="responses">
                            ${responsesHtml}
                        </div>
                        <button class="btn btn-primary" onclick="showResponseForm('${complaint.id}')">Отговорете</button>
                    </div>
                `;
                complaintsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching complaints:', error));
}

// Show response form and set the message ID
function showResponseForm(messageId) {
    document.getElementById('responseForm').style.display = 'block';
    document.getElementById('messageId').value = messageId; // Set the hidden message ID
    document.getElementById('response').focus(); // Focus on the response textarea
}

// Handle response form submission
document.getElementById('responseForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const messageId = document.getElementById('messageId').value;
    const response = document.getElementById('response').value;

    fetch('/respond-message', { // Updated API path for Vercel
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Include token for auth
        },
        body: JSON.stringify({ messageId, response })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to respond to message');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('responseStatus').textContent = data;
        document.getElementById('responseForm').reset();
        document.getElementById('responseForm').style.display = 'none'; // Hide form after submission
        fetchComplaints(); // Reload complaints after response
    })
    .catch(error => {
        document.getElementById('responseStatus').textContent = 'Error: ' + error.message;
    });
});

// Redirect to the complaint page based on token presence
function redirectToComplaintPage() {
    const token = sessionStorage.getItem('token'); // Get token from sessionStorage
    if (token) {
        window.location.href = '../service.html'; // Redirect to service page if authenticated
    } else {
        window.location.href = '../login.html'; // Redirect to login if not authenticated
    }
}

// This listener has been removed since it checks authentication
// document.getElementById('main-page-button').addEventListener('click', function(event) { ... });
