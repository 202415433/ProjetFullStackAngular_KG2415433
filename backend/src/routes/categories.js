const express = require('express');
const router = express.Router();
const CategoriesController = require('../controleurs/CategoriesController');
const verifierToken = require('../middleware/auth');

// Routes publiques
router.get('/', CategoriesController.lister);
router.get('/:id', CategoriesController.obtenir);
router.get('/:id/articles', CategoriesController.listerArticles);

// Routes protégées (nécessitent une authentification)
router.post('/', verifierToken, CategoriesController.creer);
router.put('/:id', verifierToken, CategoriesController.modifier);
router.delete('/:id', verifierToken, CategoriesController.supprimer);

module.exports = router;
