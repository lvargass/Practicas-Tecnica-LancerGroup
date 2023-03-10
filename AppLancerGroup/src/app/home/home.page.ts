import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/i-user';
import { GeneralService } from '../services/general.service';

import { BiometryType, NativeBiometric } from "capacitor-native-biometric";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userInfo: IUser | null = null;
  geolocation: any = {};
  imageURL: string = 'https://api.lancergroup.org/likeride/imagenes/avatar/x1/';

  constructor(
    private gService: GeneralService,
    private router: Router
  ) {}

  ionViewDidEnter(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.gService.refreshData().then(() => {
      this.userInfo = this.gService.userInfo;
      this.geolocation = this.gService.geolocation;
      console.log(this.userInfo, this.geolocation);
    });
  }

  async performBiometricVerification(){
    const result = await NativeBiometric.isAvailable();
  
    if(!result.isAvailable) {
      console.log('Not available');
      return;
    };

    console.log(result)
  
    // const isValid = result.biometryType == BiometryType.MULTIPLE;
  
    const verified = await NativeBiometric.verifyIdentity({
      reason: "Implementacion sencilla",
      title: "Prueba de Login",
      subtitle: "Sub titulo",
      description: "Descripcion",
    })
      .then(() => true)
      .catch(() => false);
    // Verificado o no
    if(verified) {
      this.gService.getToastCtrl('Configuracion Biometrica', 'Usuario validado.', 'bottom', 'success', 3000);
      return ;
    }
    this.gService.getToastCtrl('Configuracion Biometrica', 'Usuario Invalido.', 'bottom', 'danger', 3000);
  }

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
