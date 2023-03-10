import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  signin_form!: FormGroup;
  current_year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private gService: GeneralService,
    private router: Router
  ) { }

  ngOnInit() {
    this.signin_form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.required])] // debe contener al menos una letra y un numero)
    });
  }

  async signIn() {
    console.log(this.signin_form.value, this.signin_form.valid);
    // MAndando el request de Login
    const result = await this.gService.registerOrSigninUser({
      userEmail: this.signin_form.value.email,
      userPassword: this.signin_form.value.password
    }, 'Get_ToketLogin');
    // Verificando si hubo algun error
    if (result != null) {
      // Verificando si el usuario no existe
      if (result.code == 3) {
        this.gService.getToastCtrl('Usuario no existente', `Este usuario no existe en nuestra base de datos.`, 'top', 'danger', 5000);
        return;
      }
      // Verificando LA contraseña esta mal
      if (result.code == 2) {
        this.gService.getToastCtrl('Contraseña Incorrecta', `La contraseña ingresada es incorrecta.`, 'top', 'danger', 5000);
        return;
      }
      // Si el usuario existe, guardamos la informacion en el storage
      this.gService.saveInfoUser(result);
      // Mostramos la pagina principal
      this.gService.getToastCtrl('Inicio de sesion', 'El inicio de sesion ha sido exitoso.', 'bottom', 'success', 5000);
      this.router.navigateByUrl('/home');
    }

  }

}
