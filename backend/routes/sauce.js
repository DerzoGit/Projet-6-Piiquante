const express = require("express");
// Création d'un router avec la méthode d'express
const router = express.Router();

// Import du controller de sauce
const sauceCtrl = require("../controllers/sauce");
// Import du middleware d'authentification
const auth = require("../middleware/auth");
// Import du middleware multer
const multer = require("../middleware/multer-config");

// Route pour créer une sauce
router.post("/", auth, multer, sauceCtrl.createSauce);
// Route pour modifier une sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// Route pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);
// Route pour récupérer une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);
// Route pour récupérer toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces);
// Route pour récupérer les likes des sauces
router.post("/:id/like", auth, sauceCtrl.likeSauces);

module.exports = router;