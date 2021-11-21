// Framework express de node.js, facilite contrôle de l'API
const express = require("express");
// Mongoose pour utilisation de base de données MongoDB
const mongoose = require("mongoose");
// Import qui donne accès au chemin du système de fichier
const path = require("path");
// Import de helmet middleware permettant une protection XSS, sécurisant les requêtes HTTP notamment
const helmet = require("helmet");
// Import de express-rate-limit permettant une limitation ds requêtes à l'API, notamment sur l'autenthification
const rateLimit = require("express-rate-limit");


// Import de dotenv afin de ne pas afficher d'informations de sécurité lors de la connexion à la base de données mongoDB en utilisant des variables d'environnement
const dotenv = require("dotenv");
require("dotenv").config();

// Import du router des sauces
const sauceRoutes = require("./routes/sauce");
// Import du router des users
const userRoutes = require("./routes/user");

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URI,
    { useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));


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

// S'il y a 5 tentatives de connexion avec un mauvais mot de passe, il n'est pas possible de se tenter de se connecter pour 5 minutes
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

app.use(limiter);

// Méthode pour transformer corps de requête en objet utilisable
app.use(express.json());

// Middleware permettant une protection XSS, sécurisant les requêtes HTTP notamment
app.use(helmet());

// Middleware qui permet de récupérer les images dans le dossier dédié
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Exporte l'application pour l'utiliser dans server.js
module.exports = app;