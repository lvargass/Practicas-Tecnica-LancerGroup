import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/i-user';
import { GeneralService } from '../services/general.service';

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
    this.userInfo = this.gService.userInfo;
    this.geolocation = this.gService.geolocation;
    // console.log(this.userInfo, this.geolocation);
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
