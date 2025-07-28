const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration du port
const port = process.env.PORT || 3000;

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API du blog' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
