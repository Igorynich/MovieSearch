import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {map} from "rxjs/operators";
import {LocalStorageService} from "./local-storage.service";

@Injectable()
export class AuthService {

  private logged: boolean = false;
  private loggedAs: string = 'admin';

  constructor(private httpService: HttpService, private local: LocalStorageService) {
  }

  isLogged(): boolean {
    return this.local.usingLocalStorage()||this.logged;
  }

  isLoggedAs(): string {
    return this.local.usingLocalStorage()? 'local' : this.loggedAs;
  }

  logout() {
    this.logged = false;
    this.loggedAs = '';
  }

  authorize(credentials) {
    return this.httpService.findUser(credentials).pipe(map((value: { username, password }) => {

      if (value) {
        this.logged = true;
        this.loggedAs = value.username;
      }
      return value;
    }));
  }

}
