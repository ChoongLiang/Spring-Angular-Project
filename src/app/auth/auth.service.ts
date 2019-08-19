import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private localStorageKey: string = "koreraJwt";
  private jwtKey: string[] = ['tokenType', 'accessToken'];
  private isLoggedIn: boolean;
  private name: string = "name";
  private expiration: number;
  private jwtHelper = new JwtHelperService();

  constructor() {
    this.isLoggedIn = false;
  }

  storeJwt(jwt: object): void {
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem(this.localStorageKey, JSON.stringify(jwt));
    } else {
      alert("Please note that your browser does not support login session persistence.");
    }
  }

  getJwt(): string {
    return localStorage.getItem(this.localStorageKey) === null ? "" : this.parseJsonToJwt(localStorage.getItem(this.localStorageKey));
  }

  parseJsonToJwt(jwt: string): string {
    let json: JSON = JSON.parse(jwt);
    return (json[this.jwtKey[0]] + ' ' + json[this.jwtKey[1]])
  }

  logOut(): void {
    this.isLoggedIn = false;
  }

  cleanUpStorage(): void {
    localStorage.removeItem(this.localStorageKey);
    localStorage.removeItem(this.name);
  }

  logIn(): void {
    this.isLoggedIn = true;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  storeName(name: string): void {
    name = name.substring(0, name.indexOf("@"));
    localStorage.setItem(this.name, name);
  }

  getName(): string {
    return localStorage.getItem(this.name);
  }

  storeExpiration(expiration: string): void {
    this.expiration = Number(expiration);
  }

  getExpiration(): number {
    return this.expiration;
  }

  public isAuthenticated(): boolean {
    const token = this.getJwt();
    this.isLoggedIn = !this.jwtHelper.isTokenExpired(token);
    return this.isLoggedIn;
  }
}
