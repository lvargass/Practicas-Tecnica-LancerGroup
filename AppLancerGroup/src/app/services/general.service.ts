import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ToastController } from '@ionic/angular';
import axios from 'axios';
import { IUserRequest } from '../interfaces/i-user-request';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private baseURL: string = 'https://api.lancergroup.org/likeride/api/Auth/Register';
  private API_KEY: string = '123456';

  constructor(
    private storageS: StorageService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  /**
   * registerUser
   */
  public async registerUser(user: IUserRequest) {
    try {
      // Mostrando el loading
      const loading = await this.getLoadingCtrl({});
      // Presentando el loading
      loading.present();
      // Realizando el request
      const response = await axios.postForm(this.baseURL, {
        ...user,
        type: 1, // Obteniendo el userid o no.... con 1
        answer: 'DEV'
      }, {
        headers: {
          "x-api-key": this.API_KEY,
          "Country": "DR",
        }
      });
      // Quitando el loading
      loading.dismiss();
      // Verificando que no halla habido un error en el request
      if (response.status == 200) {
        return response.data;
      }
      // Mostrando el error devuelto
      this.getAlertCtrl({
        header: `Error - Code: ${response.status}`,
        subHeader: response.statusText,
        message: JSON.stringify(response.data),
        buttons: [
          {text: 'Okay'}
        ]
      })
      return null;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * showLoading
   */
   public async getLoadingCtrl(options: LoadingOptions = { duration: 2000 }) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'default-loading',
      message: '<p>Cargando...</p>',
      spinner: 'crescent',

      ...options
    });

    return loading;
  }

  /**
   * showAlert
   */
  public async getAlertCtrl(options: AlertOptions) {
    const alert = await this.alertCtrl.create(options);

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log(`Dismissed with role: ${role}`);
  }

  /**
   * name
   */
   async getToastCtrl(header: string, message: string, position: any, color: string, duration: number, icon?: string) {

    if (!icon) {

      switch (color) {
        case 'success':
          icon = 'checkmark-outline';
          break;
        case 'medium':
          icon = 'information-circle-outline';
          break;
        case 'danger':
          icon = 'warning-outline';
          break;
      }
    }

    const toast = await this.toastCtrl.create({
      header: header,
      message: message,
      duration: duration,
      position: position,
      color: color,
      icon: icon
    });
    await toast.present();
  }
}
