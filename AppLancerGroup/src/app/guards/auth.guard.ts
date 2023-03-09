import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {}

  async canActivate(): Promise<boolean> {
    await this.storage.init(); // Inicializando el guard
    const userInfo = await this.storage.get('userInfo'); // Obteniendo la informacion del usuario
    // Validando la informacion de usuario
    if (userInfo == undefined) {
      this.router.navigate(['/signin']);
      return false;
    }
    return true;
  }
  
}
