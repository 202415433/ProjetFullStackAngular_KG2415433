const Categorie = require('../modeles/categorie');

class CategoriesController {
    // Créer une nouvelle catégorie
    static async creer(req, res) {
        try {
            const { nom } = req.body;
            
            if (!nom) {
                return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
            }

            const nouvelleCategorie = await Categorie.creer(nom);
            res.status(201).json({
                message: 'Catégorie créée avec succès',
                categorie: nouvelleCategorie
            });
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la création de la catégorie',
                error: err.message 
            });
        }
    }

    // Modifier une catégorie
    static async modifier(req, res) {
        try {
            const { id } = req.params;
            const { nom } = req.body;

            if (!nom) {
                return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
            }

            const categorieModifiee = await Categorie.modifier(id, nom);
            res.json({
                message: 'Catégorie modifiée avec succès',
                categorie: categorieModifiee
            });
        } catch (err) {
            if (err.message === 'Catégorie non trouvée') {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ 
                    message: 'Erreur lors de la modification de la catégorie',
                    error: err.message 
                });
            }
        }
    }

    // Supprimer une catégorie
    static async supprimer(req, res) {
        try {
            const { id } = req.params;
            await Categorie.supprimer(id);
            res.json({ message: 'Catégorie supprimée avec succès' });
        } catch (err) {
            if (err.message === 'Catégorie non trouvée') {
                res.status(404).json({ message: err.message });
            } else {
                res.status(500).json({ 
                    message: 'Erreur lors de la suppression de la catégorie',
                    error: err.message 
                });
            }
        }
    }

    // Obtenir une catégorie par son ID
    static async obtenir(req, res) {
        try {
            const { id } = req.params;
            const categorie = await Categorie.trouverParId(id);
            
            if (!categorie) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            res.json(categorie);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération de la catégorie',
                error: err.message 
            });
        }
    }

    // Lister toutes les catégories
    static async lister(req, res) {
        try {
            const categories = await Categorie.listerTout();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des catégories',
                error: err.message 
            });
        }
    }

    // Lister les articles d'une catégorie
    static async listerArticles(req, res) {
        try {
            const { id } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limite = parseInt(req.query.limite) || 10;

            const resultat = await Categorie.listerArticlesParCategorie(id, page, limite);
            res.json(resultat);
        } catch (err) {
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des articles de la catégorie',
                error: err.message 
            });
        }
    }
}

module.exports = CategoriesController;
