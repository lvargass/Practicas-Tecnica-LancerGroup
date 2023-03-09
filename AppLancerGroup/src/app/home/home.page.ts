import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private gService: GeneralService,
    private router: Router
  ) {}

  /**
   * onLogout
   */
  public async onLogout() {
    const loading = await this.gService.getLoadingCtrl({duration: 1000}); // Simulamos una peticion
    // Cerrando sesion
    this.gService.logoutUser();
    loading.present(); // Presentando el loading
    // Esperando a que termine
    loading.onDidDismiss().then(() => {
      this.router.navigate(['/signin']);
    })
  }

}
