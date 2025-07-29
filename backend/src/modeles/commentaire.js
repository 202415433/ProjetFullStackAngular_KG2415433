const db = require('../config/database');

class Commentaire {
    static async creer(contenu, utilisateurId, articleId) {
        return new Promise((resolve, reject) => {
            const requete = 'INSERT INTO commentaires (contenu, utilisateurId, articleId) VALUES (?, ?, ?)';
            db.run(requete, [contenu, utilisateurId, articleId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        contenu, 
                        utilisateurId, 
                        articleId,
                        dateCreation: new Date().toISOString()
                    });
                }
            });
        });
    }

    static async modifier(id, contenu, utilisateurId) {
        return new Promise((resolve, reject) => {
            const requete = 'UPDATE commentaires SET contenu = ? WHERE id = ? AND utilisateurId = ?';
            db.run(requete, [contenu, id, utilisateurId], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Commentaire non trouvé ou non autorisé'));
                } else {
                    resolve({ id, contenu, utilisateurId });
                }
            });
        });
    }

    static async supprimer(id, utilisateurId) {
        return new Promise((resolve, reject) => {
            const requete = 'DELETE FROM commentaires WHERE id = ? AND utilisateurId = ?';
            db.run(requete, [id, utilisateurId], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Commentaire non trouvé ou non autorisé'));
                } else {
                    resolve({ id });
                }
            });
        });
    }

    static async trouverParId(id) {
        return new Promise((resolve, reject) => {
            const requete = `
                SELECT 
                    c.*,
                    u.nom as auteurNom
                FROM commentaires c
                JOIN utilisateurs u ON c.utilisateurId = u.id
                WHERE c.id = ?
            `;
            db.get(requete, [id], (err, commentaire) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(commentaire);
                }
            });
        });
    }

    static async listerParArticle(articleId, page = 1, limite = 10) {
        const offset = (page - 1) * limite;
        return new Promise((resolve, reject) => {
            const requete = `
                SELECT 
                    c.*,
                    u.nom as auteurNom,
                    (SELECT COUNT(*) FROM commentaires WHERE articleId = ?) as total
                FROM commentaires c
                JOIN utilisateurs u ON c.utilisateurId = u.id
                WHERE c.articleId = ?
                ORDER BY c.dateCreation DESC
                LIMIT ? OFFSET ?
            `;
            db.all(requete, [articleId, articleId, limite, offset], (err, commentaires) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        commentaires,
                        total: commentaires.length > 0 ? commentaires[0].total : 0,
                        page,
                        totalPages: Math.ceil(commentaires.length > 0 ? commentaires[0].total : 0 / limite)
                    });
                }
            });
        });
    }
}

module.exports = Commentaire;
