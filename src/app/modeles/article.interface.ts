import { Categorie } from './categorie.interface';

export interface Article {
    id: number;
    titre: string;
    contenu: string;
    utilisateurId: number;
    auteurNom?: string;
    dateCreation: string;
    categories?: Categorie[];
}

export interface ArticleCreation {
    titre: string;
    contenu: string;
    categories?: number[];
}

export interface ArticleReponse {
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
}
