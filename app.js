const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// CORS middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

// Middleware for parsing JSON body
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function for interacting with Supabase
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
}

// Route for user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert the new user into the Supabase database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, password }])
      .select('*')
      .single();

    if (insertError) throw new Error(insertError.message);

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header

  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Attach user info to the request object
    next();
  });
}

// Route for deleting a complaint
app.delete('/delete-complaint/:id', authenticateToken, async (req, res) => {
  const complaintId = req.params.id;
  const { password } = req.body;

  // Replace 'your-secret-password' with an environment variable or secure storage
  const SECRET_PASSWORD = 'admin';

  if (password !== SECRET_PASSWORD) {
      return res.status(403).json({ message: 'Incorrect password' });
  }

  try {
      const { data: complaint, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('id', complaintId)
          .single();

      if (fetchError) return res.status(500).json({ error: fetchError.message });
      if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

      const { error: deleteError } = await supabase
          .from('messages')
          .delete()
          .eq('id', complaintId);

      if (deleteError) return res.status(500).json({ error: deleteError.message });

      res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the password matches
    if (user.password !== password) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ message: 'User logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for saving user choices
app.post('/save-choice', authenticateToken, async (req, res) => {
  const { lineIds } = req.body;
  const userId = req.user.userId;

  try {
    const { error } = await supabase
      .from('choices')
      .insert(lineIds.map(lineId => ({
        user_id: userId,
        line_id: lineId,
        created_at: new Date().toISOString(),
      })));

    if (error) throw error;

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching selected lines
app.get('/selected-lines', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const { data: choices, error } = await supabase
      .from('choices')
      .select('line_id')
      .eq('user_id', userId);

    if (error) throw error;

    const lineIds = choices.map(choice => choice.line_id);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/get-complaints', async (req, res) => {
  try {
    const { data: complaints, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver', 'admin');

    if (error) {
      console.error('Error fetching complaints:', error.message);
      throw error;
    }

    const complaintsWithResponses = await Promise.all(
      complaints.map(async (complaint) => {
        try {
          const { data: responses, error: responseError } = await supabase
            .from('responses')
            .select('*')
            .eq('message_id', complaint.id);

          if (responseError) {
            console.error('Error fetching responses for complaint:', complaint.id, responseError.message);
            throw responseError;
          }

          const responsesWithNames = await Promise.all(
            (responses || []).map(async (response) => {
              try {
                const { data: user, error: userError } = await supabase
                  .from('users')
                  .select('name')
                  .eq('id', response.responder)
                  .single();

                if (userError) {
                  console.error('Error fetching user for response:', response.id, userError.message);
                  throw userError;
                }

                return { ...response, responder_name: user ? user.name : null };
              } catch (error) {
                console.error('Nested error in response processing:', error.message);
                throw error;
              }
            })
          );

          return { ...complaint, responses: responsesWithNames };
        } catch (error) {
          console.error('Nested error in complaint processing:', error.message);
          throw error;
        }
      })
    );

    const complaintsWithSenderName = complaintsWithResponses.map((complaint) => ({
      ...complaint,
      sender: complaint.sender,
    }));

    res.json(complaintsWithSenderName);
  } catch (error) {
    console.error('Error in /get-complaints route:', error.message);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});


// Route for sending a message
app.post('/send-message', authenticateToken, async (req, res) => { 
  const { subject, message } = req.body;
  const senderName = req.user.name; // Get sender's name directly from authenticated token

  // Check if the sender's name is available
  if (!senderName) {
    return res.status(400).send('Sender name not provided'); // Handle case where sender name is not available
  }

  try {
    // Insert the message with sender's name
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        sender: senderName, // Save sender's name from token
        receiver: 'admin',
        subject,
        message,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting message:', insertError); // Log error for debugging
      return res.status(500).send('Failed to send message'); // Handle insert error
    }

    res.status(200).send('Message sent successfully'); // Success response
  } catch (error) {
    console.error('Error sending message:', error); // Log error for debugging
    res.status(500).send('Server error'); // General server error
  }
});

// Route for responding to a message
app.post('/respond-message', authenticateToken, async (req, res) => {
  const { messageId, response } = req.body;
  const responderName = req.user.name;

  try {
      const { error } = await supabase
          .from('responses')
          .insert({ message_id: messageId, response_message: response, responder_name: responderName });

      if (error) throw error;

      res.status(200).json({ message: 'Response submitted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
