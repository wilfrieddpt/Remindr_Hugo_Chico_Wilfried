const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const exphbs  = require('express-handlebars');

const app = express();

// Configuration de Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));    

const prisma = new PrismaClient();

//routes pour l'authentification
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    // Traiter le formulaire d'inscription
});

app.get('/login', (req, res) => {
    // Afficher le formulaire de connexion
});

app.post('/login', (req, res) => {
    // Traiter le formulaire de connexion
});

//routes pour le tableau de bord de l'utilisateur
app.get('/dashboard', (req, res) => {
    // Afficher le tableau de bord de l'utilisateur
});

//routes pour la gestion des groupes
app.get('/groups/new', (req, res) => {
    // Afficher le formulaire de création de groupe
});

app.post('/groups/new', (req, res) => {
    // Traiter le formulaire de création de groupe
});

app.post('/groups/:id/users', (req, res) => {
    // Ajouter un utilisateur à un groupe
});

//routes pour la gestion des rappels
app.get('/groups/:id/reminders/new', (req, res) => {
    // Afficher le formulaire de création de rappel
});

app.post('/groups/:id/reminders/new', (req, res) => {
    // Traiter le formulaire de création de rappel
});

app.put('/groups/:id/reminders/:reminderId', (req, res) => {
    // Modifier un rappel
});

app.delete('/groups/:id/reminders/:reminderId', (req, res) => {
    // Supprimer un rappel
});


//route du tableau de bord pour afficher les rappels et les groupes
app.get('/dashboard', async (req, res) => {
    // Récupérer les rappels et les groupes de l'utilisateur
    // Afficher les rappels et les groupes
});

// Ajouter des fonctionnalités pour modifier et supprimer les rappels
// (voir les routes de gestion des rappels ci-dessus)

// Modifier la route d'affichage d'un groupe pour afficher les rappels dans l'ordre de la date d'échéance
app.get('/groups/:id', async (req, res) => {
    // Récupérer les rappels du groupe
    // Afficher les rappels dans l'ordre de la date d'échéance
});

// Ajouter une option pour afficher les rappels dépassés avec un style différent
// (cela peut être géré côté client avec du JavaScript et du CSS)



// Démarrer le serveur
const port = 3001;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
