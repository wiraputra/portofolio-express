 const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
// Pastikan path ini benar mengarah ke folder views
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Import Portfolio Context
const dataPortfolio = require('../context/portfolioContext');


// Route Home
app.get('/', (req, res) => {
    // Kita harus mengirim object dengan key 'data' agar terbaca di EJS
    res.render('home', { data: dataPortfolio });
});

// Route Games Arcade
app.get('/games', (req, res) => {
    res.render('games', { data: dataPortfolio });
});

// Route API Projects (Opsional jika ingin akses JSON)
app.get('/api/projects', (req, res) => {
    res.json(dataPortfolio.projects);
});

// Route 404 (Wajib ditaruh paling bawah)
app.use((req, res, next) => {
    res.status(404).render('404');
});

module.exports = app;