const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');



// Importe Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const app = express();



// Configuration de Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));    



app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
      maxAge: 3600000000 // Durée de la session en millisecondes (1 heure dans cet exemple)
  }
}));




// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: true }));



// Définir une route exemple
app.get('/', (req, res) => {
  res.render('accueil'); // Assure-toi d'avoir un fichier accueil.handlebars dans ton dossier "views"
});



// Route pour afficher le formulaire d'inscription
app.get('/signup', (req, res) => {
  res.render('signup');
});



// Route pour traiter les données du formulaire d'inscription
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Utilise Prisma pour vérifier si l'e-mail est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      // L'e-mail est déjà utilisé, affiche un message d'erreur
      return res.render('signup', { error: 'Cette adresse e-mail est déjà associée à un compte.' });
    }

    // L'e-mail n'est pas déjà utilisé, procède à l'inscription
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,  // Assure-toi de hacher et de saler le mot de passe avant de le stocker dans la base de données
      },
    });

    console.log('Utilisateur enregistré avec succès:', user);

    // Redirige l'utilisateur vers une page de confirmation ou une autre page appropriée
    res.redirect('/confirmation');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
    res.render('signup', { error: 'Une erreur s\'est produite lors de l\'inscription.' });
  }
});



// Route pour afficher la page de confirmation
app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});



// Route pour afficher le formulaire de connexion
app.get('/login', (req, res) => {
  res.render('login');
});



// Route pour traiter les données du formulaire de connexion
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Recherche l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      // Utilisateur non trouvé, redirige vers la page de login
      return res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Vérifie le mot de passe (en comparant en texte brut)
    if (password === user.password) {
      // Authentification réussie, enregistre l'utilisateur dans la session
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/dashboard'); // Redirige vers la page du tableau de bord ou toute autre page
    } else {
      // Mot de passe incorrect, redirige vers la page de login
      res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.render('login', { error: 'Une erreur s\'est produite lors de l\'authentification.' });
  }
});



app.get('/dashboard', (req, res) => {
  // Vérifie si l'utilisateur est connecté
  if (req.session.user) {
    // Utilisateur connecté, rend la page du tableau de bord
    res.render('dashboard', { username: req.session.user.username });
  } else {
    // Utilisateur non connecté, redirige vers la page de login
    res.redirect('/login');
  }
});



app.post('/logout', (req, res) => {
  // Déconnecte l'utilisateur en détruisant la session
  req.session.destroy((err) => {
      if (err) {
          console.error('Erreur lors de la déconnexion:', err);
          res.render('error', { error: 'Une erreur s\'est produite lors de la déconnexion.' });
      } else {
          // Redirige vers la page d'accueil ou toute autre page
          res.redirect('/');
      }
  });
});



// Démarrer le serveur
const port = 3001;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
