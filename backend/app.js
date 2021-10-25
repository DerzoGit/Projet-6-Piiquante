// Framework express de node.js, facilite contrôle de l'API
const express = require("express");

// Création de l'application en express
const app = express();

// CORS Headers (Cross Origin Resource Sharing), gère accès à l'API
app.use((req, res, next) => {
    // Autoisation d'accès à l'API, * = tout le monde
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Autorisation des headers
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    // Autorisation des methods 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// Méthode pour transformer corps de requête en objet utilisable
app.use(express.json());

// Exporte l'application pour l'utiliser dans server.js
module.exports = app;