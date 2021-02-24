const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const user   = require('../models/User');
require('dotenv').config();


exports.signup = (req, res, next) => {
    const email_valid = /^[\w._-]+@[\w._-]+\.[a-z]{2,6}$/i;
    // const pass_valid = 
    if (!email_valid.test(req.body.email)) {
        return res.status(401).json({ error: 'Email non valide...' });
    }
    bcrypt.hash(req.body.password, 10)
    .then(pass_hash => {
        user.create({ ...req.body, password: pass_hash })
        .then((user) => res.status(201).json({ user }))
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
}

exports.login = (req, res, next) => {
    user.findOne({ where: { email: req.body.email }})
    .then(user => {
        if(!user) {
            return res.status(401).json({ message: 'Email inconnu !' }); // identifiants incorrects !
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect ! '}); // identifiants incorrects !
            }
            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    bio: user.bio,
                    isAdmin: user.isAdmin,
                    token:
                    jwt.sign({ userId: user.id },
                    process.env.USER_TOKEN,
                    { expiresIn: '24h' })
                },
                
            })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}

exports.modify = (req, res, next) => {
    user.update({ ...req.body }, { where: { id: req.params.id }})
    .then(() => res.status(200).json({ message: "l'utilisateur à bien été modifié !" }))
    .catch(error => res.status(500).json({ error }));
}

exports.delete = (req, res, next) => {
    user.destroy({ where: { id: req.params.id }})
    .then(() => res.status(200).json({ message: "l'utilisateur à bien été supprimé !"}))
    .catch(error => res.status(500).json({ error }));
}

exports.getUser = (req, res, next) => {
    user.findOne({ where: { id: req.params.id }})
    .then(user => res.status(200).json({ user }))
    .catch(error => res.status(500).json({ error }));
}

exports.getUsers = (req, res, next) => {
    user.findAll()
    .then(users => res.status(200).json({ users }))
    .catch(error => res.status(500).json({ error }));
}
