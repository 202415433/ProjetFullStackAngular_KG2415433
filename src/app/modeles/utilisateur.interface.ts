export interface Utilisateur {
    id: number;
    nom: string;
    email: string;
    dateCreation?: string;
}

export interface UtilisateurConnexion {
    email: string;
    motDePasse: string;
}

export interface UtilisateurInscription {
    nom: string;
    email: string;
    motDePasse: string;
}
