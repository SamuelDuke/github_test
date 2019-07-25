const jwt = require('jsonwebtoken');
const configMain = require('../config/main');

const User = require('../data_models/user');

const generateToken = (user) => {
    return jwt.sign(user, configMain.jwtSecret, {
        expiresIn: configMain.jwtExpiration // in seconds
    });
};

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

exports.createUser = (req, res, next) => {
    //ToDo add validation on email, password, etc

    const { firstName, lastName, password, email } = req.body;

    if (validateEmail(req.body.email)) {
        User({
            firstName,
            lastName,
            password,
            email
        }).save()
            .then(user => {
                res.status(201).json(user.infoToSend())
            })
            .catch(err => {
                res.status(422).json({error: 'There was an error'});
                return next(err);
            })
    } else {
        return res.status(400).json({error: 'There was an error creating the user.'});
    }
};

exports.getJWTLocal = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (user === null) {
                return res.status(400).json({error: 'That email is not registered.'});
            }
            if (user.validPassword(req.body.password)) {
                const token = generateToken(user.infoToSend());
                return res.status(200).json({token: token});
            } else {
                return res.status(400).json({error: 'That is the wrong password.'});
            }
        }).then(null, err => { return next(err); })
};