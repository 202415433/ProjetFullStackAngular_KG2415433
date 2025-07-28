const db = require('../config/database');
const bcrypt = require('bcrypt');

class Utilisateur {
    static async creer(nom, email, motDePasse) {
        try {
            const motDePasseHash = await bcrypt.hash(motDePasse, 10);
            return new Promise((resolve, reject) => {
                const requete = 'INSERT INTO utilisateurs (nom, email, motDePasse) VALUES (?, ?, ?)';
                db.run(requete, [nom, email, motDePasseHash], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, nom, email });
                    }
                });
            });
        } catch (err) {
            throw err;
        }
    }

    static async trouverParEmail(email) {
        return new Promise((resolve, reject) => {
            const requete = 'SELECT * FROM utilisateurs WHERE email = ?';
            db.get(requete, [email], (err, utilisateur) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(utilisateur);
                }
            });
        });
    }

    static async verifierMotDePasse(motDePasseNonHash, motDePasseHash) {
        return bcrypt.compare(motDePasseNonHash, motDePasseHash);
    }

    static async trouverParId(id) {
        return new Promise((resolve, reject) => {
            const requete = 'SELECT id, nom, email, dateCreation FROM utilisateurs WHERE id = ?';
            db.get(requete, [id], (err, utilisateur) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(utilisateur);
                }
            });
        });
    }
}
