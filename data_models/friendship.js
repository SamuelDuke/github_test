const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({
    friendsId: {type: String, unique: true, required: true},
    friends: {
        type: [{type: Schema.Types.ObjectId, ref: 'User'}],
        validate: [friendshipLimit, '{PATH} there must be 2 friends total.']
    },
    //requester:{type: Schema.Types.ObjectId, ref: 'User'},
    //requested:{type: Schema.Types.ObjectId, ref: 'User'},
    status: {
        type: Number,
        enums: [
            0,    //'requested',
            1,    //'approved',
            2,    //'declined',
            3,    //'blocked'
        ]
    }
});

FriendshipSchema.statics.createFriendshipId = function(userId, friendId) {
    const list = [userId, friendId];
    const sortList = list.sort();
    return sortList.join();
};

// FriendshipSchema.pre('save', function(next) {
//     let friendship = this;
//
//     if (!friendship.isModified('friendshipId')) return next();
//     friendship.friendshipId = friendship.friends.sort().join();
//     next();
// });

function friendshipLimit(friends){
    return friends.length == 2;
}

module.exports = mongoose.model('Friendship', FriendshipSchema);