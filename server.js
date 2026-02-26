const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/challenges', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'challenges.html'));
});

app.listen(PORT, () => {
  console.log(`M1778-Dungen server running at http://localhost:${PORT}`);
});
