const express = require('express');
const router = express.Router();
const CommentsController = require('../controleurs/CommentsController');
const verifierToken = require('../middleware/auth');

// Routes publiques
router.get('/article/:articleId', CommentsController.listerParArticle);
router.get('/:id', CommentsController.obtenir);

// Routes protégées (nécessitent une authentification)
router.post('/', verifierToken, CommentsController.creer);
router.put('/:id', verifierToken, CommentsController.modifier);
router.delete('/:id', verifierToken, CommentsController.supprimer);

module.exports = router;
