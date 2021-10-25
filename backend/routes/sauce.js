const express = require("express");
// Création d'un router avec la méthode d'express
const router = express.Router();

// Import du controller de sauce
const sauceCtrl = require("../controllers/sauce");

// Route pour créer une sauce
router.post("/", sauceCtrl.createSauce);
// Route pour modifier une sauce
router.put("/:id", sauceCtrl.modifySauce);
// Route pour supprimer une sauce
router.delete("/:id", sauceCtrl.deleteSauce);
// Route pour récupérer une sauce
router.get("/:id", sauceCtrl.getOneSauce);
// Route pour récupérer toutes les sauces
router.get("/", sauceCtrl.getAllSauce);
// Route pour récupérer les likes des sauces
// router.post("/:id/like", sauceCtrl.likeSauce);

module.exports = router;