const express = require('express');  
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken'); // Add JWT for token handling

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
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Session management middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use environment variable for secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 // 1-hour session expiration
  }
}));

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

async function addUser(user) {
  const { data, error } = await supabase
    .from('users')
    .insert([user]);

  if (error) throw error;
  return data;
}

// Route for user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();  // Ensures only one row is returned

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert the new user into the Supabase database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ name, email, password }])  // Hash password in production
      .select('*')
      .single();  // Ensures only one row is returned

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'User registered successfully', token }); // Return the token
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication middleware
function authenticateUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
  }
  next();
}

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the password matches (in production, compare hashed passwords)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

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

// Route to check authentication status
app.get('/check-auth', authenticateUser, (req, res) => {
  res.json({ isAuthenticated: true, userId: req.session.userId });
});

// Route for saving user choices
app.post('/save-choice', authenticateUser, async (req, res) => {
  const { lineIds } = req.body;
  const userId = req.session.userId;

  try {
    const { data, error } = await supabase
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
app.get('/selected-lines', authenticateUser, async (req, res) => {
  const userId = req.session.userId;

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

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
