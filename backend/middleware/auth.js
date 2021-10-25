// Package qui créé les token et les vérifie pour la connexion
const jwt = require("jsonwebtoken");

// Middleware qui permet de récupérer le token, de le vérifier ainsi que de décoder le token. S'il est différent, l'utilisateur n'est pas authentifié, sinon le contrôle est passé 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID non valide !";
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | "Requête non authentifiée ! "});
    }
};