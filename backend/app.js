// Framework express de node.js, facilite contrôle de l'API
const express = require("express");
// Mongoose pour utilisation de base de données MongoDB
const mongoose = require("mongoose");

// Import du router des sauces
const sauceRoutes = require("./routes/sauce");
// Import du router des users
const userRoutes = require("./routes/user");

// Connexion à la base de données MongoDB
mongoose.connect("mongodb+srv://Derzo:<password>@cluster0.z4bn4.mongodb.net/P6-Piiquante?retryWrites=true&w=majority",
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

// Méthode pour transformer corps de requête en objet utilisable
app.use(express.json());

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Exporte l'application pour l'utiliser dans server.js
module.exports = app;