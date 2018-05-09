import {Injectable} from '@angular/core';
import {HttpService} from "./http.service";
import {map} from "rxjs/operators";

@Injectable()
export class AuthService {

  private logged: boolean = false;
  private loggedAs: string = 'admin';

  constructor(private httpService: HttpService) {
  }

  isLogged(): boolean {
    return this.logged;
  }

  isLoggedAs(): string {
    return this.loggedAs;
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
