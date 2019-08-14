const express = require('express');
const passport = require('passport');

const passportStrategy = require('./config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
    passportStrategy(app);

    const authRoutes = express.Router();
    const AuthController = require('./routes/auth');
    authRoutes.post('/login', AuthController.getJWTLocal);
    authRoutes.post('/register', AuthController.createUser);

    app.use('/auth', authRoutes);

    const apiRoutes = express.Router();

    const userRoutes = express.Router();
    const UserController = require('./routes/user');
    const FriendshipController = require('./routes/friendship');
    userRoutes.get('/', UserController.getAllUsers);
    userRoutes.get('/me', UserController.getMe);
    userRoutes.get('/:id', UserController.getUser);
    userRoutes.delete('/:id', UserController.deleteUser);
    userRoutes.put('/group', UserController.joinGroup);


    apiRoutes.use('/users', userRoutes);

    const friendRoutes = express.Router();
    friendRoutes.post('/', FriendshipController.create);
    friendRoutes.get('/', FriendshipController.getFriends);
    friendRoutes.get('/requested', FriendshipController.getFriendRequests);
    friendRoutes.put('/requested', FriendshipController.acceptFriendRequest);

    apiRoutes.use('/friends', friendRoutes);

    const groupRoutes = express.Router();
    const GroupController = require('./routes/group');
    groupRoutes.post('/', GroupController.create);
    groupRoutes.get('/:groupId', GroupController.getAllMembers);

    apiRoutes.use('/groups', groupRoutes);

    const adminRoutes = express.Router();
    app.use('/admin', adminRoutes);

    app.use('/api', requireAuth, apiRoutes);
};