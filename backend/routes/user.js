const express = require("express");
// Création d'un router avec la méthode d'express
const router = express.Router();
// Import du controller de user
const userCtrl = require("../controllers/user");

// Route d'inscription de l'utilisateur
router.post("/signup", userCtrl.signup);
// Route de connexion de l'utilisateur
router.post("/login", userCtrl.login);

module.exports = router;