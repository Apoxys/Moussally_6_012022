const sauce = require('../models/saucesModel');
const fs = require('fs');

// See all sauces and see one sauce
exports.getAllSauces = (req, res, next) => {
    sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


// Adding new sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    const newSauce = new sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    newSauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée au répertoire!' }))
        .catch(error => res.status(400).json({ error }));
};

//modify user's sauce
exports.modifyOneSauce = (req, res, next) => {
    let sauceObject = req.body
    sauce.findOne({ _id: req.params.id })
        .then(oldSauce => {
            if (req.file) {
                console.log("req.file ok")              
                let linkImgToRemove = oldSauce.imageUrl.split('http://localhost:3000/')
                fs.unlink('./' + linkImgToRemove[1], (err) => {
                    if (err) {
                        console.log(err)
                    }
                    sauceObject = {
                        ...sauceObject,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({message: res.message}))
                        .catch(error => res.status(400).json({error}));
                })
            } else {
                sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce mise à jour' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }))
};

// delete user's sauce
exports.deleteOneSauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: new Error('sauce non trouvée') })
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ error: new Error('Vous ne pouvez pas supprimer cette sauce') })
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            })

        })
        .catch(error => res.status(400).json({ error }))
};

//likes and dislikes
exports.likes = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //mise à jour du status like ou dislike
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId)
            }
            else if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId)
            }
            else if (req.body.like == 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    const thisUserIndex = sauce.usersLiked.indexOf(req.body.userId)
                    sauce.usersLiked.splice(thisUserIndex, 1)
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    const thisUserIndex = sauce.usersDisliked.indexOf(req.body.userId)
                    sauce.usersDisliked.splice(thisUserIndex, 1)
                }
            }
            sauce.likes = sauce.usersLiked.length
            sauce.dislikes = sauce.usersDisliked.length
            sauce.save()
                .then((sauce) => res.status(200).json({ message: 'likes et dislikes mis à jour' }))
                .catch(() => res.status(400).json({ error: new Error }));
        })
        .catch(error => res.status(400).json({ error }));
};