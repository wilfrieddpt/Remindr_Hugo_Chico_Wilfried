const express = require('express');
const path = require('path');

const app = express();





// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});