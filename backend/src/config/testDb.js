const db = require('./database');

// Test simple pour vérifier la connexion
db.get("SELECT 1", (err, row) => {
    if (err) {
        console.error("Erreur lors du test de la base de données:", err);
    } else {
        console.log("Test de la base de données réussi !");
    }
    
    // Fermer la connexion après le test
    db.close((err) => {
        if (err) {
            console.error("Erreur lors de la fermeture de la connexion:", err);
        } else {
            console.log("Connexion à la base de données fermée");
        }
    });
});
