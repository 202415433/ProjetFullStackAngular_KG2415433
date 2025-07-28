const db = require('../config/database');

class Article {
    static async creer(titre, contenu, utilisateurId, categories = []) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // Insertion de l'article
                db.run(
                    'INSERT INTO articles (titre, contenu, utilisateurId) VALUES (?, ?, ?)',
                    [titre, contenu, utilisateurId],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }

                        const articleId = this.lastID;

                        // Si des catégories sont spécifiées, les associer à l'article
                        if (categories.length > 0) {
                            const stmt = db.prepare('INSERT INTO articles_categories (articleId, categorieId) VALUES (?, ?)');
                            
                            categories.forEach(categorieId => {
                                stmt.run(articleId, categorieId, (err) => {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        return reject(err);
                                    }
                                });
                            });
                            
                            stmt.finalize();
                        }

                        db.run('COMMIT', (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }
                            resolve({ id: articleId, titre, contenu, utilisateurId });
                        });
                    }
                );
            });
        });
    }

    static async modifier(id, titre, contenu, utilisateurId) {
        return new Promise((resolve, reject) => {
            const requete = 'UPDATE articles SET titre = ?, contenu = ? WHERE id = ? AND utilisateurId = ?';
            db.run(requete, [titre, contenu, id, utilisateurId], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Article non trouvé ou non autorisé'));
                } else {
                    resolve({ id, titre, contenu, utilisateurId });
                }
            });
        });
    }

    static async supprimer(id, utilisateurId) {
        return new Promise((resolve, reject) => {
            const requete = 'DELETE FROM articles WHERE id = ? AND utilisateurId = ?';
            db.run(requete, [id, utilisateurId], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Article non trouvé ou non autorisé'));
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
                    a.*,
                    u.nom as auteurNom,
                    GROUP_CONCAT(c.id) as categorieIds,
                    GROUP_CONCAT(c.nom) as categorieNoms
                FROM articles a
                LEFT JOIN utilisateurs u ON a.utilisateurId = u.id
                LEFT JOIN articles_categories ac ON a.id = ac.articleId
                LEFT JOIN categories c ON ac.categorieId = c.id
                WHERE a.id = ?
                GROUP BY a.id
            `;
            db.get(requete, [id], (err, article) => {
                if (err) {
                    reject(err);
                } else {
                    if (article) {
                        // Formatage des catégories
                        article.categories = article.categorieIds 
                            ? article.categorieIds.split(',').map((id, index) => ({
                                id: parseInt(id),
                                nom: article.categorieNoms.split(',')[index]
                            }))
                            : [];
                        delete article.categorieIds;
                        delete article.categorieNoms;
                    }
                    resolve(article);
                }
            });
        });
    }

    static async listerTout(page = 1, limite = 10) {
        const offset = (page - 1) * limite;
        return new Promise((resolve, reject) => {
            const requete = `
                SELECT 
                    a.*,
                    u.nom as auteurNom,
                    GROUP_CONCAT(c.id) as categorieIds,
                    GROUP_CONCAT(c.nom) as categorieNoms,
                    (SELECT COUNT(*) FROM articles) as total
                FROM articles a
                LEFT JOIN utilisateurs u ON a.utilisateurId = u.id
                LEFT JOIN articles_categories ac ON a.id = ac.articleId
                LEFT JOIN categories c ON ac.categorieId = c.id
                GROUP BY a.id
                ORDER BY a.dateCreation DESC
                LIMIT ? OFFSET ?
            `;
            db.all(requete, [limite, offset], (err, articles) => {
                if (err) {
                    reject(err);
                } else {
                    // Formatage des catégories pour chaque article
                    const articlesFormates = articles.map(article => {
                        article.categories = article.categorieIds 
                            ? article.categorieIds.split(',').map((id, index) => ({
                                id: parseInt(id),
                                nom: article.categorieNoms.split(',')[index]
                            }))
                            : [];
                        delete article.categorieIds;
                        delete article.categorieNoms;
                        return article;
                    });
                    resolve({
                        articles: articlesFormates,
                        total: articles.length > 0 ? articles[0].total : 0,
                        page,
                        totalPages: Math.ceil(articles.length > 0 ? articles[0].total : 0 / limite)
                    });
                }
            });
        });
    }
}

module.exports = Article;
