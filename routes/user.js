const mongoose = require('mongoose');
const User = require('../data_models/user');

exports.getAllUsers = (req, res, next) => {
    User.find().exec()
        .then(users => {
            const updatedUsers = users.map((user) => {
                return user.infoToSend();
            });
            return res.status(200).json(updatedUsers);
        })
        .then(null, err => { return next(err) });
};

exports.getUser = (req, res, next) => {
    User.findOne({_id: req.params.id}).exec()
        .then(user => {
            if (user === null) { return next(); }
            return res.status(200).json(user.infoToSend());
        })
        .then(null, err => { return next(err); });
};

exports.getMe = (req, res, next) => {
    User.findOne({_id: req.user._id})
        .populate('groups')
        .exec()
        .then(me => {
            return res.status(200).json(me.infoToSend());
        }).catch(err => {
            res.status(400).json({error: 'There was an error'})
            return next(err);
    })
};

exports.deleteUser = (req, res, next) => {
    User.find({_id: req.params.id}).remove().exec()
        .then((user) => {
            user.userId = req.params.id;
            return res.status(200).json(user);
        })
        .then(null, err => { return next(err); });
};

exports.joinGroup = (req, res, next) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        { $addToSet: {groups: req.body.groupId }},
        { upsert: true, new: true}
    ).then(user => {
        return res.status(200).json(user.populate('groups'))
    }).catch(err => {
        return next(err);
    })
};

