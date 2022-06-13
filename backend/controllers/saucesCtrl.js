const sauce = require('../models/saucesModel');

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
    delete req.body._id;
    const newSauce = new sauce({
        ...req.body
    });
    newSauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée au répertoire!' }))
        .catch(error => res.status(400).json({ error }));
};

//modify user's sauce
exports.modifyOneSauce = (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce mise à jour' }))
        .catch(error => res.status(400).json({ error }));
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
            sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                .catch(error => res.status(400).json({ error }));
        })
};

//likes and dislikes
exports.likes = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //mise à jour du status like ou dislike
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId)
            }
            if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId)
            }
            if (req.body.like == 0) {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    const thisUserIndex = sauce.usersLiked.indexOf(req.body.userId)
                    sauce.usersLiked.splice(thisUserIndex, 1)
                }
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    const thisUserIndex = sauce.usersDisliked.indexOf(req.body.userId)
                    sauce.usersDisliked.splice(thisUserIndex, 1)
                }
            }

            const currentLikes = usersLiked.length
            sauce.likes = currentLikes
            const currentDislikes = usersDisliked.length
            sauce.dislikes = currentDislikes

            sauce.save()
                .then((sauce) => res.status(200).json({ message: 'likes et dislikes mis à jour' }))
                .catch(error => res.status(400).json({ error }));

            res.status(200).json(usersLiked)
        })
        .catch(error => res.status(400).json({ error }));
};