export interface Commentaire {
    id: number;
    contenu: string;
    utilisateurId: number;
    articleId: number;
    auteurNom?: string;
    dateCreation: string;
}

export interface CommentaireCreation {
    contenu: string;
    articleId: number;
}

export interface CommentaireReponse {
    commentaires: Commentaire[];
    total: number;
    page: number;
    totalPages: number;
}
