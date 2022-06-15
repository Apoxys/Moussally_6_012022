const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = require("../models/userModel");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const thisNewUser = new user({
                email: req.body.email,
                password: hash
            });
            thisNewUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    user.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found!' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'wrong password!' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(501).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};