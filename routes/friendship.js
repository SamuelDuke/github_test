const mongoose = require('mongoose');
const Friendship =  require('../data_models/friendship');
//const User = require('../data_models/user');

exports.create = (req, res, next) => {
    // const id = [req.user._id, req.body.friendId].sort().join()
    // console.log('id', id);

    const id = Friendship.createFriendshipId(req.user._id, req.body.friendId);

    Friendship({
        friendsId : id,
        friends: [req.user._id, req.body.friendId],
        status: 0
    }).save()
        .then(friendship  => {
            return res.status(201).json(friendship)
        })
        .catch(err => {
           console.log('create friendship error', err);
           res.status(500).json(err);
           return next(err)
        });
};

