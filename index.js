const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

// Configuration de Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Définir une route exemple
app.get('/', (req, res) => {
    res.render('accueil'); // Assure-toi d'avoir un fichier accueil.handlebars dans ton dossier "views"
});

// Définir une route exemple
app.get('/accueil', (req, res) => {
  res.render('accueil', { message: 'Bonjour, ceci est un message dynamique.' });
});


// Démarrer le serveur
const port = 3001;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});