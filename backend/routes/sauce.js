const express = require("express");
// Création d'un router avec la méthode d'express
const router = express.Router();

// Import du controller de sauce
const sauceCtrl = require("../controllers/sauce");

router.post("/", sauceCtrl.createSauce);

router.put("/:id", sauceCtrl.modifySauce);

router.delete("/:id", sauceCtrl.deleteSauce);

router.get("/:id", sauceCtrl.getOneSauce);

router.get("/", sauceCtrl.getAllSauce);

module.exports = router;