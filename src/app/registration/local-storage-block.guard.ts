import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {LocalStorageService} from "../services/local-storage.service";

@Injectable()
export class LocalStorageBlockGuard implements CanActivate {

  constructor(private local: LocalStorageService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.blockWhenLocalStorageIsUsed();
  }

  blockWhenLocalStorageIsUsed():boolean{
    this.router.navigate(['/search']);
    return !this.local.usingLocalStorage();
  }
}
