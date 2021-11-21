// Cryptage des password
const bcrypt = require("bcrypt");
// Package qui créé les token et les vérifie pour la connexion
const jwt = require("jsonwebtoken");
// Import du model de User
const User = require("../models/user");
// Import de password-validator pour renforcer les mots de passe
const passwordValidator = require("password-validator");

// Créé un schema pour password-validator
const schema = new passwordValidator();

// Inscription et sauvegarde de l'utilisateur avec l'email saisi et hash du password
exports.signup = (req, res, next) => {
    // Ajoute les propriétés au schema de password-validator
    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().uppercase() // Must have uppercase letters
        .has().lowercase() // Must have lowercase letters
        .has().digits(2) // Must have at least 2 digits
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    if (schema.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({
                    message: "Utilisateur créé !"
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
    } else {
        return res.status(401).json({
            message: "Mot de passe pas assez fort !"
        });
    };
};


// Connexion de l'utilisateur avec vérification dans la base de données s'il est présent, puis vérifie le hash du password. Si oui, envoie le token de connexion
exports.login = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: "Utilisateur non trouvé!"
                });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: "Mot de passe incorrect !"
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id
                            },
                            "RANDOM_TOKEN_SECRET", {
                                expiresIn: "24h"
                            }
                        )
                    });
                })
        })
        .catch(error => res.status(500).json({
            error
        }));
};