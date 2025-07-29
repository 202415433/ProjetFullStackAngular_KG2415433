const Commentaire = require('../modeles/commentaire');

class CommentsController {
    // Créer un nouveau commentaire
    static async creer(req, res) {
        try {
            const { contenu, articleId } = req.body;
            const utilisateurId = req.utilisateur.id;

            if (!contenu || !articleId) {
                return res.status(400).json({ 
                    message: 'Le contenu et l\'ID de l\'article sont requis' 
                });
            }

            const nouveauCommentaire = await Commentaire.creer(contenu, utilisateurId, articleId);
            res.status(201).json({
                message: 'Commentaire créé avec succès',
                commentaire: nouveauCommentaire
            });
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la création du commentaire',
                error: err.message 
            });
        }
    }

    // Modifier un commentaire
    static async modifier(req, res) {
        try {
            const { id } = req.params;
            const { contenu } = req.body;
            const utilisateurId = req.utilisateur.id;

            if (!contenu) {
                return res.status(400).json({ 
                    message: 'Le contenu du commentaire est requis' 
                });
            }

            const commentaireModifie = await Commentaire.modifier(id, contenu, utilisateurId);
            res.json({
                message: 'Commentaire modifié avec succès',
                commentaire: commentaireModifie
            });
        } catch (err) {
            if (err.message === 'Commentaire non trouvé ou non autorisé') {
                res.status(403).json({ message: err.message });
            } else {
                res.status(500).json({ 
                    message: 'Erreur lors de la modification du commentaire',
                    error: err.message 
                });
            }
        }
    }

    // Supprimer un commentaire
    static async supprimer(req, res) {
        try {
            const { id } = req.params;
            const utilisateurId = req.utilisateur.id;

            await Commentaire.supprimer(id, utilisateurId);
            res.json({ message: 'Commentaire supprimé avec succès' });
        } catch (err) {
            if (err.message === 'Commentaire non trouvé ou non autorisé') {
                res.status(403).json({ message: err.message });
            } else {
                res.status(500).json({ 
                    message: 'Erreur lors de la suppression du commentaire',
                    error: err.message 
                });
            }
        }
    }

    // Obtenir un commentaire par son ID
    static async obtenir(req, res) {
        try {
            const { id } = req.params;
            const commentaire = await Commentaire.trouverParId(id);
            
            if (!commentaire) {
                return res.status(404).json({ message: 'Commentaire non trouvé' });
            }

            res.json(commentaire);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération du commentaire',
                error: err.message 
            });
        }
    }

    // Lister les commentaires d'un article
    static async listerParArticle(req, res) {
        try {
            const { articleId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limite = parseInt(req.query.limite) || 10;

            const resultat = await Commentaire.listerParArticle(articleId, page, limite);
            res.json(resultat);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des commentaires',
                error: err.message 
            });
        }
    }
}

module.exports = CommentsController;
