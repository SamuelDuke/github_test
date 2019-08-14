const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendshipSchema = new Schema({

    requester: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    requested:{type: Schema.Types.ObjectId, ref: 'User', required: true},

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

module.exports = mongoose.model('Friendship', FriendshipSchema);