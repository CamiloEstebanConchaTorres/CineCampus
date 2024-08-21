const express = require('express');
const app = express();
const peliculaRoutes = require ("./routes/peliculaRoutes");
const compraRoutes = require('./routes/compraRoutes')
require('dotenv').config();

app.use(express.static(process.env.EXPRESS_STATIC));
app.use(peliculaRoutes);
app.use(compraRoutes);


app.get("/", function (req, res) {
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, { root: __dirname });
});


app.listen({
    host: process.env.EXPRESS_HOST, 
    port: parseInt(process.env.EXPRESS_PORT)
}, () => {
    
    console.log(`Servidor corriendo en: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});