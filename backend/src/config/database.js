const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH);

// Création de la connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion à la base de données SQLite établie');
        initializerBaseDeDonnees();
    }
});

// Fonction pour initialiser la base de données
function initializerBaseDeDonnees() {
    db.serialize(() => {
        // Table Utilisateurs
        db.run(`CREATE TABLE IF NOT EXISTS utilisateurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            motDePasse TEXT NOT NULL,
            dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table Articles
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            contenu TEXT NOT NULL,
            utilisateurId INTEGER NOT NULL,
            dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (utilisateurId) REFERENCES utilisateurs (id)
        )`);

        // Table Catégories
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL UNIQUE
        )`);

        // Table de liaison Articles-Catégories
        db.run(`CREATE TABLE IF NOT EXISTS articles_categories (
            articleId INTEGER,
            categorieId INTEGER,
            PRIMARY KEY (articleId, categorieId),
            FOREIGN KEY (articleId) REFERENCES articles (id),
            FOREIGN KEY (categorieId) REFERENCES categories (id)
        )`);

        // Table Commentaires
        db.run(`CREATE TABLE IF NOT EXISTS commentaires (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contenu TEXT NOT NULL,
            utilisateurId INTEGER NOT NULL,
            articleId INTEGER NOT NULL,
            dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (utilisateurId) REFERENCES utilisateurs (id),
            FOREIGN KEY (articleId) REFERENCES articles (id)
        )`);

        console.log('Schéma de la base de données initialisé avec succès');
    });
}

module.exports = db;
