document.addEventListener('DOMContentLoaded', fetchComplaints);

function fetchComplaints() {
    fetch('/get-complaints', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch complaints');
            }
            return response.json();
        })
        .then(complaints => {
            console.log('Fetched complaints:', complaints);
            const complaintsList = document.getElementById('complaintsList');
            complaintsList.innerHTML = ''; // Clear existing content
            
            complaints.forEach(complaint => {
                // Generate HTML for responses
                const responsesHtml = complaint.responses && complaint.responses.length > 0
                    ? complaint.responses.map(res => 
                        `<p><strong>Отговор:</strong> ${res.response_message} (от ${res.responder_name})</p>`).join('')
                    : '<p><strong>Отговор:</strong> Все още няма отговор</p>';

                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="complaint-item">
                        <p><strong>${complaint.subject}</strong> - ${complaint.message} (от ${complaint.sender})</p> <!-- Ensure 'sender' matches the property -->
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

    fetch('/respond-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
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
        document.getElementById('responseForm').style.display = 'none';
        fetchComplaints(); // Reload complaints after response
    })
    .catch(error => {
        document.getElementById('responseStatus').textContent = 'Error: ' + error.message;
    });
});

// Redirect to the complaint page based on token presence
function redirectToComplaintPage() {
    const token = sessionStorage.getItem('token');
    if (token) {
        window.location.href = '../service.html';
    } else {
        alert('You must be logged in to submit a complaint. Redirecting to login page.');
        window.location.href = '../login.html';
    }
}
