const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Turso (SQLite) database
const db = new Database(process.env.TURSO_DB_URL, { verbose: console.log }); // Use Turso Cloud URL

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

// Helper function to generate JWT tokens
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Helper function to verify JWT tokens
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// Route for user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const stmt = db.prepare('INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword, new Date().toISOString());

    res.json({ message: 'User registered successfully', userId: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve the user from the database
    const user = db.prepare('SELECT id, password FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user.id);

    res.json({ message: 'User logged in successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to check if the user is authenticated
async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token missing' });
  }

  try {
    const decodedToken = verifyToken(token);
    req.userId = decodedToken.userId; // Store user ID for later use
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token - Authentication failed' });
  }
}

// Route for checking user authentication
app.get('/check-auth', authenticateUser, (req, res) => {
  res.json({ isAuthenticated: true });
});

// Route for saving user choices
app.post('/save-choice', authenticateUser, async (req, res) => {
  const { lineIds } = req.body;
  const userId = req.userId;

  try {
    const stmt = db.prepare('INSERT INTO choices (userId, lineId, createdAt) VALUES (?, ?, ?)');
    const promises = lineIds.map(lineId => stmt.run(userId, lineId, new Date().toISOString()));
    await Promise.all(promises);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching selected lines
app.get('/selected-lines', authenticateUser, async (req, res) => {
  const userId = req.userId;

  try {
    const stmt = db.prepare('SELECT lineId FROM choices WHERE userId = ?');
    const choices = stmt.all(userId);

    const lineIds = choices.map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
