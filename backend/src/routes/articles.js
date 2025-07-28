const express = require('express');
const router = express.Router();
const ArticlesController = require('../controleurs/ArticlesController');
const verifierToken = require('../middleware/auth');

// Routes publiques
router.get('/', ArticlesController.lister);
router.get('/:id', ArticlesController.obtenir);

// Routes protégées
router.post('/', verifierToken, ArticlesController.creer);
router.put('/:id', verifierToken, ArticlesController.modifier);
router.delete('/:id', verifierToken, ArticlesController.supprimer);

module.exports = router;
