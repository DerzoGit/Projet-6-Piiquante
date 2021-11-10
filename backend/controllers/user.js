// Cryptage des password
const bcrypt = require("bcrypt");
// Package qui créé les token et les vérifie pour la connexion
const jwt = require("jsonwebtoken");
// Import du model de User
const User = require("../models/user");

// Inscription et sauvegarde de l'utilisateur avec l'email saisi et hash du password
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// Connexion de l'utilisateur avec vérification dans la base de données s'il est présent, puis vérifie le hash du password. Si oui, envoie le token de connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé!" });
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    "RANDOM_TOKEN_SECRET",
                    { expiresIn: "24h" }
                )
            });
        })
    })
    .catch(error => res.status(500).json({ error }));
};