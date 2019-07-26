const mongoose = require('mongoose');
const Group = require('../data_models/group');
const User = require('../data_models/user');

exports.create = (req, res, next) => {
    const {name, description} = req.body;
    Group({
        name,
        description
    }).save()
        .then(group => {
            User.findOneAndUpdate(
                {_id: req.user._id},
                { $addToSet: {groups: group._id}},
                { upsert: true, new: true }
            ).then( user => {
                    return res.status(201).json(user.infoToSend());
                })
                .catch(err => {
                    res.status(422).json({error: 'There was an error here.'});
                    return next(err)
                });
        })
        .catch(err => {
            console.log('err.code: ', err);
            if (err.name === 'MongoError' && err.code === 11000) {
                res.status(422).json({
                    name: err.name,
                    code: err.code,
                    errmsg: 'This group name is already taken please select another one.'
                });
                return next(err)
            }

            res.status(422).json({error: 'There was an error saving the group in the database.'});
            return next(err)
        });
};

exports.getAllMembers = (req, res, next) => {
    User.find({groups: req.params.groupId}, '-password -email -groups')
        .exec()
        .then(members => {
            return res.status(200).json(members)
        }).catch(err => {
            console.log('getAllUsers Error', err);
            res.status(400).json({errmsg: 'There was an error getting all members.'});
            return next(err)
    })
};
