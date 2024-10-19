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
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'User registered successfully', token });
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
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ message: 'User logged in successfully', token });
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
app.get('/get-complaints', authenticateToken, async (req, res) => {
  try {
    const { data: complaints, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver', 'admin'); // Change as per your logic

    if (error) throw error;

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for sending a message
app.post('/send-message', authenticateToken, async (req, res) => {
  const { subject, message } = req.body;
  const sender = req.user.userId;

  try {
    await supabase
      .from('messages')
      .insert({
        sender: sender,
        receiver: 'admin',
        subject,
        message,
        created_at: new Date().toISOString(),
      });

    res.status(200).send('Message sent successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route for responding to a message
app.post('/respond-message', authenticateToken, async (req, res) => {
  const { messageId, response } = req.body;
  const responder = req.user.userId;

  try {
    const { error } = await supabase
      .from('responses')
      .insert({
        message_id: messageId,
        responder: responder,
        response_message: response,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    res.status(200).send('Response sent successfully');
  } catch (error) {
    console.error('Error responding to message:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
