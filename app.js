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
      return res.status(400).json({ error: 'Потребителя вече съществува' });
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

    res.json({ message: 'Успешно регистриране на потребителя', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) return res.status(404).json({ error: 'Потребителя не е намерен' });

    // Check if the password matches
    if (user.password !== password) return res.status(400).json({ error: 'Неправилни данни' });

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ message: 'Потребителя влезе успешно', token });
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

// Initialize a default admin user if not already present
(async () => {
  const defaultAdminEmail = 'admin@admin.com';
  const defaultAdminPassword = 'admin';
  const { data: adminExists, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', defaultAdminEmail)
    .single();

  if (error) throw error;

  if (!adminExists) {
    const { data: newAdmin, error: insertError } = await supabase
      .from('users')
      .insert([{ name: 'Admin', email: defaultAdminEmail, password: defaultAdminPassword }])
      .select('*')
      .single();

    if (insertError) throw insertError;
  }
})();

app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ensure only the admin email can log in
    if (email !== 'admin@admin.com') {
      return res.status(403).json({ error: 'Нямате право да влезете като администратор' });
    }

    // Admin authentication
    const admin = await getUserByEmail(email);

    if (!admin) return res.status(404).json({ error: 'Не успешно намиране на администратора' });

    // Assuming the admin password is also stored in the Supabase database
    if (admin.password !== password) return res.status(400).json({ error: 'Грешни администраторски данни' });

    // Generate a JWT token for admin
    const adminToken = jwt.sign({ userId: admin.id, email: admin.email, name: admin.name }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Успешно влизане като администратор', token: adminToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/users', authenticateToken, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email');

    if (error) throw error;

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for deleting a user
app.post('/delete-user', authenticateToken, async (req, res) => {
  const { userId } = req.body;

  try {
    const { errorc } = await supabase
      .from('choices')
      .delete()
      .eq('user_id', userId);

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error,errorc;

    res.status(200).send('Успешно изтриване на потребител');
  } catch (error) {
    console.error('Грешка при изтриването на потребител:', error);
    res.status(500).send('Грешка в сървъра');
  }
});
// Route for posting news (only accessible by admin)
app.post('/send-news', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  // Ensure the user is an admin
  if (req.user.email !== 'admin@admin.com') {
    return res.status(403).json({ error: 'Нямате право да изпращате новини' });
  }

  try {
    const { error } = await supabase
      .from('news')
      .insert([{ title, content }]);

    if (error) throw error;

    res.status(200).json({ message: 'Успешно изпращане на новини' });
  } catch (error) {
    console.error('Грешка при изпращането на новини:', error);
    res.status(500).json({ error: error.message });
  }
});
// Route for fetching news
app.get('/get-news', async (req, res) => {
  try {
      const { data: news, error } = await supabase
          .from('news') // Your table name for news
          .select('*')
          .order('created_at', { ascending: false });

      if (error) {
          return res.status(500).json({ message: 'Грешка при извличане на новини' });
      }

      res.json({ news });
  } catch (error) {
      console.error('Грешка при извличане на новини:', error);
      res.status(500).json({ message: 'Грешка при извличане на новини' });
  }
});

app.delete('/delete-news/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ message: 'Неуспешно изтриване на новини' });
    }

    res.status(200).json({ message: 'Успешно изтриване на новини!' });
  } catch (error) {
    console.error('Грешка при изтриването на новини', error);
    res.status(500).json({ message: 'Грешка при изтриването на новини' });
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

// Route for getting complaints
app.get('/get-complaints', async (req, res) => {
  try {
    // Fetch complaints where the receiver is 'admin'
    const { data: complaints, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver', 'admin'); // Ensure this logic fits your requirements

    if (error) throw error;

    // Fetch responses for each complaint
    const complaintsWithResponses = await Promise.all(complaints.map(async (complaint) => {
      const { data: responses, error: responseError } = await supabase
        .from('responses')
        .select('*')
        .eq('message_id', complaint.id);
        
      if (responseError) throw responseError;

      // Attach responder names to responses
      const responsesWithNames = await Promise.all(responses.map(async (res) => {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('id', res.responder) // Assuming 'responder' stores the user ID
          .single();
        
        if (userError) throw userError;
        return { ...res, responder_name: user.name }; // Add responder name to response
      }));

      return { ...complaint, responses: responsesWithNames }; // Combine complaint with its responses
    }));

    // Combine complaint data with sender's name
    const complaintsWithSenderName = await Promise.all(complaintsWithResponses.map(async (complaint) => {
      // Get the sender's name from the messages table
      const senderName = complaint.sender; // sender already contains the name based on your earlier update
      return { ...complaint, sender: senderName }; // Return complaint with sender name
    }));

    res.json(complaintsWithSenderName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for sending a message
app.post('/send-message', authenticateToken, async (req, res) => { 
  const { subject, message } = req.body;
  const senderName = req.user.name; // Get sender's name directly from authenticated token

  // Check if the sender's name is available
  if (!senderName) {
    return res.status(400).send('Не е дадено име на изпращача'); // Handle case where sender name is not available
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
      console.error('Грешка при вкарване на съобшението:', insertError); // Log error for debugging
      return res.status(500).send('Неуспешно изпращане на съобщението'); // Handle insert error
    }

    res.status(200).send('Успешно изпращане на съобщението'); // Success response
  } catch (error) {
    console.error('Грешка при изпращане на съобшението::', error); // Log error for debugging
    res.status(500).send('Сървърна грешка'); // General server error
  }
});

// Route for responding to a message
app.post('/respond-message', authenticateToken, async (req, res) => {
  const { messageId, response } = req.body;
  const responder = req.user.userId;

  try {
    // Fetch the responder's name
    const { data: responderData, error: fetchError } = await supabase
      .from('users')
      .select('name')
      .eq('id', responder)
      .single();

    if (fetchError) throw fetchError;

    const responderName = responderData.name;

    const { error } = await supabase
      .from('responses')
      .insert({
        message_id: messageId,
        responder: responder,
        responder_name: responderName, // Store the responder's name
        response_message: response,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    res.status(200).send('Успешно изпращане на отговор');
  } catch (error) {
    console.error('Грешка при отговаряне на новина:', error);
    res.status(500).send('Сърварна грешка');
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
