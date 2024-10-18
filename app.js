const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');

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
  secret: 'yourSecretKey', // Change this to a secure random key
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour session expiration
  }
}));

// Helper function to read JSON file
function readJsonFileSync(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write to JSON file
function writeJsonFileSync(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Paths for user data and choices
const usersFilePath = path.join(__dirname, 'users.json');
const choicesFilePath = path.join(__dirname, 'choices.json');

// Route for user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  try {
    const users = readJsonFileSync(usersFilePath);

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert the new user into the "database"
    const newUser = {
      id: users.length + 1, // Simple ID generation
      name,
      email,
      password, // In production, hash the password
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeJsonFileSync(usersFilePath, users);

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
function authenticateUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
  }
  next();
}

// Route for checking user authentication
app.get('/check-auth', authenticateUser, (req, res) => {
  res.json({ isAuthenticated: true, userId: req.session.userId });
});
// Route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const users = readJsonFileSync(usersFilePath);
    const user = users.find(user => user.email === email);

    if (!user || user.password !== password) { // Simple password check, replace with hashed check
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Store user ID in session
    req.session.userId = user.id;
    req.session.userName = user.name;

    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
  }
  next();
}

// Route for saving user choices
app.post('/save-choice', authenticateUser, (req, res) => {
  const { lineIds } = req.body;
  const userId = req.session.userId;

  try {
    const choices = readJsonFileSync(choicesFilePath);
    const userChoices = choices[userId] || [];

    // Save choices
    lineIds.forEach(lineId => {
      userChoices.push({
        lineId,
        createdAt: new Date().toISOString(),
      });
    });
    choices[userId] = userChoices;
    writeJsonFileSync(choicesFilePath, choices);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for fetching selected lines
app.get('/selected-lines', authenticateUser, (req, res) => {
  const userId = req.session.userId;

  try {
    const choices = readJsonFileSync(choicesFilePath);
    const userChoices = choices[userId] || [];
    const lineIds = userChoices.map(choice => choice.lineId);
    res.json(lineIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
