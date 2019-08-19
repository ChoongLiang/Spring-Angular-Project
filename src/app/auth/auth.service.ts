import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private localStorageKey: string = "koreraJwt";
  private jwtKey: string[] = ['tokenType', 'accessToken'];
  private isLoggedIn: boolean;

  constructor() { 
    this.isLoggedIn = false;
  }

  storeJwt(jwt: object): void {
    if (typeof(Storage) !== "undefined") {
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
  }

  logIn(): void {
    this.isLoggedIn = true;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

}
