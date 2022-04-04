import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOnlyGuard implements CanActivate {
  private canAccess: boolean = false

  constructor (private auth: UserAuthService, private router: Router) {
    this.auth.isAuth$.subscribe(isAuth => {
      this.canAccess = isAuth
    })
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.canAccess) {
      alert("Access denied, please login!")
      this.router.navigate(["/login"])
    }
    return this.canAccess
  }
}
