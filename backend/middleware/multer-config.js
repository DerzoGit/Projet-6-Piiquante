// Package multer qui permet de gérer les fichiers dans les requêtes HTTP
const multer = require("multer");

// Génère l'extension des fichiers
const MIME_TYPES = {
    "images/jpg": "jpg",
    "images/jpeg": "jpg",
    "images/png": "png"
};

// Objet de configuration pour multer. Envoie dans le dossier de destination des images. Change le nom du fichier et son extension
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetypes];
        callback(null, name + Date.now() + "." + extension);
    }
});

module.exports = multer({ storage }).single("image");