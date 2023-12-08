const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// Importe Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// Configuration de Handlebars
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));    

// Middleware pour parser les données du formulaire
app.use(express.urlencoded({ extended: true }));

// Route pour afficher le formulaire d'inscription
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Route pour traiter les données du formulaire d'inscription
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Utilise Prisma pour enregistrer l'utilisateur dans la base de données
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

app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});


// Définir une route exemple
app.get('/', (req, res) => {
    res.render('accueil'); // Assure-toi d'avoir un fichier accueil.handlebars dans ton dossier "views"
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.render('login');
}); 

// Démarrer le serveur
const port = 3001;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
