const jwt = require('jsonwebtoken');
const Utilisateur = require('../modeles/utilisateur');

class UsersController {
    // Inscription d'un nouvel utilisateur
    static async inscription(req, res) {
        try {
            const { nom, email, motDePasse } = req.body;

            // Vérification si l'utilisateur existe déjà
            const utilisateurExistant = await Utilisateur.trouverParEmail(email);
            if (utilisateurExistant) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }

            // Création du nouvel utilisateur
            const nouvelUtilisateur = await Utilisateur.creer(nom, email, motDePasse);

            // Génération du token JWT
            const token = jwt.sign(
                { id: nouvelUtilisateur.id, email: nouvelUtilisateur.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                utilisateur: nouvelUtilisateur,
                token
            });
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de l\'inscription', error: err.message });
        }
    }

    // Connexion d'un utilisateur
    static async connexion(req, res) {
        try {
            const { email, motDePasse } = req.body;

            // Recherche de l'utilisateur
            const utilisateur = await Utilisateur.trouverParEmail(email);
            if (!utilisateur) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Vérification du mot de passe
            const motDePasseValide = await Utilisateur.verifierMotDePasse(motDePasse, utilisateur.motDePasse);
            if (!motDePasseValide) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Génération du token JWT
            const token = jwt.sign(
                { id: utilisateur.id, email: utilisateur.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Connexion réussie',
                utilisateur: {
                    id: utilisateur.id,
                    nom: utilisateur.nom,
                    email: utilisateur.email
                },
                token
            });
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
        }
    }

    // Obtenir le profil de l'utilisateur connecté
    static async profil(req, res) {
        try {
            const utilisateur = await Utilisateur.trouverParId(req.utilisateur.id);
            if (!utilisateur) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            res.json(utilisateur);
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: err.message });
        }
    }
}

module.exports = UsersController;
