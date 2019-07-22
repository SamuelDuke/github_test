const mongoose = require('mongoose');
const User = require('../data_models/user');

exports.getAllUsers = (req, res, next) => {
    console.log('getAllUsers has been called');
    console.log('req', req);
    User.find().exec()
        .then(users => {
            // console.log('users', users);
            const updatedUsers = users.map((user) => {
                return user.infoToSend();
            });
            return res.status(200).json({status: 'Success', data: updatedUsers})
        })
        .then(null, err => { return next(err) });
};

exports.getUser = (req, res, next) => {

    User.findOne({_id: req.params.id}).exec()
        .then(user => {
            if (user === null) { return next(); }
            return res.status(200).json({status: 'Success', data: user});
        })
        .then(null, err => { return next(err); });
};

exports.deleteUser = (req, res, next) => {
    console.log('req', req);

    User.find({_id: req.params.id}).remove().exec()
        .then((user) => {
            user.userId = req.params.id;
            return res.status(200).json({status: 'Success', data: user});
        })
        .then(null, err => { return next(err); });
};

exports.createUser = (req, res, next) => {
    User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        memberships: []
    }).save()
        .then(user => {
            res.status(201).json({status: 'Success', data: user})
        })
        .then(null, err => { return next(err); });
};

exports.notAllowed405 = (req, res, next) => {
    res.status(405).json({status: ERROR, message: "You can not use a POST method with users/:id"});
};

exports.updateUser = (req, res, next) => {
    User.findOne({_id: req.params.id}).exec()
        .then(user => {
            switch (req.params.property) {
                case "firstName":
                    user.firstName = req.params.value;
                    break;
                case "lastName":
                    user.lastName = req.params.value;
                    break;
                default:
                    res.status(400).json({status: ERROR, message: "You did not enter a valid property to update."})
            }
            user.save().then(user => {
                res.status(200).json({status: 'Success', data: user});
            }).then(null, err => { return next(err)});
        })
        .then(null, err => { return next(err)});
};

exports.updateUsers = (req, res, next) => {
    User.find().exec()
        .then(users => {
            updatedUsers = users.map(user => user.firstName = req.params.value); //error handle this
            updatedUsers.save();
            res.status(200).json({status: 'Success', data: users});
        })
        .then(null, err => { return next(err)});
};

