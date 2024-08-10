const express = require('express');
const app = express();
const asientoRoutes = require('./routes/asientoRoutes');
const peliculaRoutes = require ("./routes/peliculaRoutes"); // Im
require('dotenv').config();

app.use(express.static(process.env.EXPRESS_STATIC));
app.use(asientoRoutes);
app.use(peliculaRoutes);

app.get("/", function (req, res) {
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, { root: __dirname });
});

app.listen({
    host: process.env.EXPRESS_HOST, 
    port: parseInt(process.env.EXPRESS_PORT)
}, () => {
    console.log(`Servidor corriendo en: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});