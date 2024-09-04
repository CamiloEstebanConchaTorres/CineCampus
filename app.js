const express = require('express');
const cors = require('cors');
const app = express();
const peliculaRoutes = require('./routes/peliculaRoutes');
const compraRoutes = require('./routes/compraRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

app.use(cors());
app.use(express.json()); // Añadir middleware para JSON
app.use(express.static(process.env.EXPRESS_STATIC));
app.use(peliculaRoutes);
app.use(compraRoutes);
app.use(userRoutes);



app.get("/", (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, { root: __dirname });
});

app.listen({
    host: process.env.EXPRESS_HOST || '0.0.0.0', 
    port: process.env.PORT || 5001
}, () => {
    console.log(`Servidor corriendo en: http://localhost:${process.env.PORT || 5001}`);
});

