const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const categoriesRoutes = require('./routes/categories');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/categories', categoriesRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API du blog' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur est survenue !', error: err.message });
});

// Configuration du port
const port = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
