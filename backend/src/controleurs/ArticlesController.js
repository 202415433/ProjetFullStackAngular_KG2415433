const Article = require('../modeles/article');

class ArticlesController {
    // Créer un nouvel article
    static async creer(req, res) {
        try {
            const { titre, contenu, categories } = req.body;
            const utilisateurId = req.utilisateur.id;

            const nouvelArticle = await Article.creer(titre, contenu, utilisateurId, categories);
            res.status(201).json({
                message: 'Article créé avec succès',
                article: nouvelArticle
            });
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la création de l\'article',
                error: err.message 
            });
        }
    }

    // Modifier un article
    static async modifier(req, res) {
        try {
            const { id } = req.params;
            const { titre, contenu } = req.body;
            const utilisateurId = req.utilisateur.id;

            const articleModifie = await Article.modifier(id, titre, contenu, utilisateurId);
            res.json({
                message: 'Article modifié avec succès',
                article: articleModifie
            });
        } catch (err) {
            if (err.message === 'Article non trouvé ou non autorisé') {
                res.status(403).json({ message: err.message });
            } else {
                res.status(500).json({ 
                    message: 'Erreur lors de la modification de l\'article',
                    error: err.message 
                });
            }
        }
    }

    // Supprimer un article
    static async supprimer(req, res) {
        try {
            const { id } = req.params;
            const utilisateurId = req.utilisateur.id;

            await Article.supprimer(id, utilisateurId);
            res.json({ message: 'Article supprimé avec succès' });
        } catch (err) {
            if (err.message === 'Article non trouvé ou non autorisé') {
                res.status(403).json({ message: err.message });
            } else {
                res.status(500).json({ 
                    message: 'Erreur lors de la suppression de l\'article',
                    error: err.message 
                });
            }
        }
    }

    // Obtenir un article par son ID
    static async obtenir(req, res) {
        try {
            const { id } = req.params;
            const article = await Article.trouverParId(id);
            
            if (!article) {
                return res.status(404).json({ message: 'Article non trouvé' });
            }

            res.json(article);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération de l\'article',
                error: err.message 
            });
        }
    }

    // Lister tous les articles
    static async lister(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limite = parseInt(req.query.limite) || 10;

            const resultat = await Article.listerTout(page, limite);
            res.json(resultat);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des articles',
                error: err.message 
            });
        }
    }
}

module.exports = ArticlesController;
