const jwt = require('jsonwebtoken');
const configMain = require('../config/main');
const json_res = require('../config/main').formatted_response;

const User = require('../data_models/user');

const generateToken = (user) => {
    return jwt.sign(user, configMain.jwtSecret, {
        expiresIn: configMain.jwtExpiration // in seconds
    });
};

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    console.log('re.test(email);', re.test(email));
    return re.test(email);
};

exports.createUser = (req, res, next) => {
    //ToDo add validation on email, password, etc
    console.log('validateEmail(req.body.email)', validateEmail(req.body.email));
    if (validateEmail(req.body.email)) {
        User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        }).save()
            .then(user => {
                json_res(res, 201, true, user, 'User Created');
                //res.status(201).json(hf.jsonResponse.success(null))
            })
            .catch(err => {
                json_res(res, 422, false, err, 'There was an error');
                return next(err);
            })
    } else {
        return json_res(res, 400, false, null, 'There was an error creating the user.');
    }
};

exports.getJWTLocal = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (user === null) {
                return json_res(res, 400, false, null, 'That email is not registered.');
            }
            if (user.validPassword(req.body.password)) {
                // const responseData = {
                //     token: 'Bearer ' + generateToken(user.infoToSend()),
                //     user: user.infoToSend()
                // };
                const token = generateToken(user.infoToSend());
                // const userToSend = user.infoToSend();
                return res.status(200).json({status: 'success', token: token});
            } else {
                return json_res(res, 400, false, null, 'That is the wrong password.');
                //res.status(422).json(hf.jsonResponse.error({password: 'The password was not entered correctly'}));
            }
        }).then(null, err => { return next(err); })
};