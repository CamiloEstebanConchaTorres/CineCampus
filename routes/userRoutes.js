const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

router.get('/user', async (req, res) => {
    try {
        await client.connect();
        const db = client.db();
        const usersCollection = db.collection('usuario');
        
        // Simulando la obtención del usuario actual, normalmente lo obtendrás de una sesión o token
        const currentUserId = '66a00d936a82374ecd0c82fc'; // Ejemplo de ObjectId

        // Convertir la cadena a ObjectId
        const userObjectId = new ObjectId(currentUserId);

        const user = await usersCollection.findOne({ _id: userObjectId });
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
