import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthorized(next.params.username);
  }

  isAuthorized(username): boolean {
    if (this.auth.isLogged()) {
      return true;
    }
    if (this.auth.isLoggedAs() == username) {
      return true;
    }
    this.router.navigate(['/search']);

    return false;
  }
}
