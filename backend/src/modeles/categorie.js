const db = require('../config/database');

class Categorie {
    static async creer(nom) {
        return new Promise((resolve, reject) => {
            const requete = 'INSERT INTO categories (nom) VALUES (?)';
            db.run(requete, [nom], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, nom });
                }
            });
        });
    }

    static async modifier(id, nom) {
        return new Promise((resolve, reject) => {
            const requete = 'UPDATE categories SET nom = ? WHERE id = ?';
            db.run(requete, [nom, id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Catégorie non trouvée'));
                } else {
                    resolve({ id, nom });
                }
            });
        });
    }

    static async supprimer(id) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // Supprimer d'abord les relations dans la table de liaison
                db.run('DELETE FROM articles_categories WHERE categorieId = ?', [id], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }

                    // Ensuite supprimer la catégorie
                    db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }
                        if (this.changes === 0) {
                            db.run('ROLLBACK');
                            return reject(new Error('Catégorie non trouvée'));
                        }
                        
                        db.run('COMMIT', (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }
                            resolve({ id });
                        });
                    });
                });
            });
        });
    }

    static async trouverParId(id) {
        return new Promise((resolve, reject) => {
            const requete = `
                SELECT 
                    c.*,
                    COUNT(DISTINCT ac.articleId) as nombreArticles
                FROM categories c
                LEFT JOIN articles_categories ac ON c.id = ac.categorieId
                WHERE c.id = ?
                GROUP BY c.id
            `;
            db.get(requete, [id], (err, categorie) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(categorie);
                }
            });
        });
    }

    static async listerTout() {
        return new Promise((resolve, reject) => {
            const requete = `
                SELECT 
                    c.*,
                    COUNT(DISTINCT ac.articleId) as nombreArticles
                FROM categories c
                LEFT JOIN articles_categories ac ON c.id = ac.categorieId
                GROUP BY c.id
                ORDER BY c.nom
            `;
            db.all(requete, [], (err, categories) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(categories);
                }
            });
        });
    }

    static async listerArticlesParCategorie(categorieId, page = 1, limite = 10) {
        const offset = (page - 1) * limite;
        return new Promise((resolve, reject) => {
            const requete = `
                SELECT 
                    a.*,
                    u.nom as auteurNom,
                    c.nom as categorieNom,
                    (SELECT COUNT(*) FROM articles_categories WHERE categorieId = ?) as total
                FROM articles a
                JOIN articles_categories ac ON a.id = ac.articleId
                JOIN categories c ON ac.categorieId = c.id
                JOIN utilisateurs u ON a.utilisateurId = u.id
                WHERE ac.categorieId = ?
                ORDER BY a.dateCreation DESC
                LIMIT ? OFFSET ?
            `;
            db.all(requete, [categorieId, categorieId, limite, offset], (err, articles) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        articles,
                        total: articles.length > 0 ? articles[0].total : 0,
                        page,
                        totalPages: Math.ceil(articles.length > 0 ? articles[0].total : 0 / limite)
                    });
                }
            });
        });
    }
}

module.exports = Categorie;
