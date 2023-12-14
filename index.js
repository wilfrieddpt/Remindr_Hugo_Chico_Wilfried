//Importer express
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

//Importer Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//Cette ligne sert à éviter de préciser dans les routes que les fichiers sont dans le dossier views
app.set('views', path.join(__dirname, 'views')); 


// Importer Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//configuration de la session
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

//****************************************************************

// Création des routes
app.get('/', (req, res) => {
  res.render('accueil', {layout:'main.handlebars'});
});

app.get('/login', (req, res) => {
  res.render('login');
});

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
      req.session.user = { username: user.username };
      res.redirect('/dashboard');
    } else {
      // Mot de passe incorrect, redirige vers la page de login
      res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.render('login', { error: 'Une erreur s\'est produite lors de l\'authentification.' });
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Recherche l'utilisateur dans la base de données
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      // L'e-mail est déjà utilisé, affiche un message d'erreur
      return res.render('signup', { error: 'Cette adresse e-mail est déjà associée à un compte.' });
    }

    // L'e-mail n'est pas déjà utilisé, on procède à l'inscription
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,E
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

app.get('/logout', (req, res) => {
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

app.get('/dashboard', async(req, res) => {
  // Vérifie si l'utilisateur est connecté
  if (req.session.user) {
    const myUser = { username: req.session.user.username };
    const fakeTasks = await prisma.Task.findMany({
      where: {
          group: {
              users: {
                  some: {
                      username: myUser.username
                  }
              }
          }
      },
      select: {
          group: true,
          publisher: true,
          dateSubmit: true,
          color: true,
          name: true,
          description: true,
          validated: true
      },
      orderBy: {
          dateSubmit: 'asc'
      }
    });
    res.render('dashboard', { tasks: fakeTasks, username: myUser.username });
  } else {
    // Utilisateur non connecté, redirige vers la page de login
    res.redirect('/login');
  }
});
  

//****************************************************************

// Démarrer le serveur
const port = 3001;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});
