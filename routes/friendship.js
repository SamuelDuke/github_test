const mongoose = require('mongoose');
const Friendship =  require('../data_models/friendship');

exports.create = (req, res, next) => {
    const user = req.user._id;
    const friend = req.body.friendId;

    Friendship.findOne({
        $or: [
            { $and: [{requester: user}, {requested: friend}] },
            { $and: [{requester: friend}, {requested: user}] }
        ]
    })
        .exec()
        .then(friendship => {

            if (!friendship) {
                Friendship({
                    requester: user,
                    requested: friend,
                    status: 0
                }).save()
                    .then(friendship  => {
                        return res.status(201).json(friendship)
                    })
                    .catch(err => {
                        res.status(500).json(err);
                        return next(err)
                    });
            } else {
                res.status(200).json(friendship)
            }
        })
        .catch(err => {
            res.json(err);
            return next(err);
        });
};

exports.getFriends = (req, res, next) => {
    const user = req.user._id;

    Friendship.find({
        $and: [
            { $or: [{requester: user}, {requested: user}] },
            { $or: [{status: 1}] }
        ]
    })
        .populate('requester', 'firstName lastName _id')
        .populate('requested', 'firstName lastName _id')
        .exec()
        .then(friendships => {
            console.log(friendships);
            const friends = friendships.map((friendship) => {
                if (friendship.requester._id.toString() == user) {
                    return friendship.requested
                } else {
                    return friendship.requester
                }
            });
            res.status(200).json(friends);
        })
        .catch(err => {
            res.json(err);
            return next(err);
        });
};

exports.getFriendRequests = (req, res, next) => {
    const user = req.user._id;

    Friendship.find({ requested: user, status: 0 })
        .populate('requester', 'firstName lastName _id')
        .exec()
        .then(friendRequests => {
            const friends = friendRequests.map((friendship) => {
                return friendship.requester;
            });
            res.status(200).json(friends);
        })
        .catch(err => {
            res.status(500).json(err);
            return next(err);
        });
};

exports.acceptFriendRequest = (req, res, next) => {
    const user = req.user._id;
    const friend = req.body.friendId;

    Friendship.findOneAndUpdate({
        requester: friend,
        requested: user,
        status: 0
    },{
        $set: {status: 1}
    })
        .exec()
        .then(friendship => {
            console.log(friendship);

            res.status(200).json(friendship);
        })
        .catch(err => {
            res.json(err);
            return next(err);
        });
};

//This is to committ

