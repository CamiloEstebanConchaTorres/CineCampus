const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const Connect = require('../config/connect');

router.get('/user', async (req, res) => {
    try {
        const connect = new Connect();
        const db = connect.db;
        const usersCollection = db.collection('usuario');
        
        const envUser = process.env.MONGO_USER;

        const user = await usersCollection.findOne({ username: envUser });

        if (user) {
            res.json({
                username: user.username,
                avatar: user.avatar
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
