import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur, UtilisateurConnexion, UtilisateurInscription } from '../modeles/utilisateur.interface';

interface AuthResponse {
  message: string;
  utilisateur: Utilisateur;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private utilisateurConnecte = new BehaviorSubject<Utilisateur | null>(null);
  utilisateurConnecte$ = this.utilisateurConnecte.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier s'il y a un token stocké au démarrage
    const token = this.getToken();
    if (token) {
      this.chargerProfil().subscribe();
    }
  }

  inscription(donnees: UtilisateurInscription): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/inscription`, donnees)
      .pipe(
        tap(reponse => {
          this.setToken(reponse.token);
          this.utilisateurConnecte.next(reponse.utilisateur);
        })
      );
  }

  connexion(donnees: UtilisateurConnexion): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/connexion`, donnees)
      .pipe(
        tap(reponse => {
          this.setToken(reponse.token);
          this.utilisateurConnecte.next(reponse.utilisateur);
        })
      );
  }

  deconnexion(): void {
    localStorage.removeItem('token');
    this.utilisateurConnecte.next(null);
  }

  chargerProfil(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/profil`)
      .pipe(
        tap(utilisateur => this.utilisateurConnecte.next(utilisateur))
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  estConnecte(): boolean {
    return !!this.getToken();
  }
}
