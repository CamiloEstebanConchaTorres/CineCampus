const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const peliculaRoutes = require('./routes/peliculaRoutes');
const compraRoutes = require('./routes/compraRoutes');
const userRoutes = require('./routes/userRoutes');

// Configuración
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';
const STATIC_DIR = 'public';


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, STATIC_DIR)));

// Rutas
app.use(peliculaRoutes);
app.use(compraRoutes);
app.use(userRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, STATIC_DIR, 'index.html'));
});

// Inicio del servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en: http://${HOST}:${PORT}`);
});
