const Sauce = require("../models/sauce");
// Import fs, file system, permet de modifier le système de fichiers
const fs = require("fs");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        // Initialisation des likes, dislikes et des utilisateurs ayant like ou dislike la sauce
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: "Objet enregistré !"
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: "Objet modifié !"
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({
                _id: req.params.id
            })
            .then(() => res.status(200).json({
                message: "Objet supprimé !"
            }))
            .catch(error => res.status(400).json({
                error
            }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.likeSauces = (req, res, next) => {
    // Récupère le like dans le corps de la requête
    const like = req.body.like;
    // Récupère l'ID de la sauce
    const sauceId = req.params.id;
    // Récupère l'ID de l'utilisateur
    const userId = req.body.userId;

    Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
    // Ajout d'un like
    if (like === 1) {
        Sauce.updateOne({ _id: sauceId }, { $inc: { likes: 1 }, $push: { usersLiked: userId }})
        .then(() => res.status(200).json({ message: "Like ajouté" }))
        .catch((error) => res.status(400).json({ error }));
    }

    // Ajout d'un dislike
    if (like === -1) {
        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId }})
        .then(() => res.status(200).json({ message: "Dislike ajouté" }))
        .catch((error) => res.status(400).json({ error }));
    }

    // Retrait d'un like ou d'un dislike
    if (like === 0) {
        if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId }})
                .then(() => res.status(200).json({ message: "Like retiré" }))
                .catch((error) => res.status(400).json({ error }));
            }
            if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }})
                .then(() => res.status(200).json({ message: "Dislike retiré" }))
                .catch((error) => res.status(400).json({ error }));
            }
    }})
    .catch((error) => res.status(404).json({ error }));
};