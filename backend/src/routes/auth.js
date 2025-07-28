const express = require('express');
const router = express.Router();
const UsersController = require('../controleurs/UsersController');
const verifierToken = require('../middleware/auth');

// Routes publiques
router.post('/inscription', UsersController.inscription);
router.post('/connexion', UsersController.connexion);

// Routes protégées
router.get('/profil', verifierToken, UsersController.profil);

module.exports = router;
