import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signup_form!: FormGroup;
  protected slides: any = {
    isEnd: false,
    isBeginning: true
  };

  constructor(
    private formBuilder: FormBuilder,
    private gService: GeneralService,
    private router: Router
  ) {}

  ngOnInit() {
    // Configurando el formulario y agregando validaciones
    this.signup_form = this.formBuilder.group({
      first_name: ['LUIYI', Validators.compose([Validators.maxLength(30), Validators.required])],
      last_name: ['VARGAS', Validators.compose([Validators.maxLength(30), Validators.required])],
      email: ['lvargas9715@gmail.com', Validators.compose([Validators.email, Validators.required])],
      phone: ['8092700415', Validators.compose([Validators.maxLength(10), Validators.required])],
      password: ['12345678', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.required])], // debe contener al menos una letra y un numero)
      password_repeat: ['12345678', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.required])] // debe contener al menos una letra y un numero)
    });
  }

  setSwiperInstance(swiper: any) {
    // Instanciando el slider
    this.slides = swiper;
    // Bloqueando el acceso a swipe para que solo nos permita mediante los botones
    this.slides.allowTouchMove = false;
    this.changePage('back');
    console.log(swiper);
  }
  
  onSlideChange() {
    console.log(this.slides.activeIndex)
  }

  /**
   * signUp
   */
  async signUp() {
    // If email or password empty
    if (this.signup_form.value.email == '' || this.signup_form.value.password == '' || this.signup_form.value.password_repeat == ''){
      alert('Error: Please fill in all fields');
      return;
    }
    // If passwords do not match
    if (this.signup_form.value.password != this.signup_form.value.password_repeat) {
      alert('Error: Passwords must match');
      return;
    }
    // Mandando a registrar el usuario General Service
    const result = await this.gService.registerOrSigninUser({
      userEmail: this.signup_form.value.email,
      userPassword: this.signup_form.value.password,
      userName: `${this.signup_form.value.first_name} ${this.signup_form.value.last_name}`,
      userPhoneNumber: this.signup_form.value.phone,
      userProfilePic: 'data:image/jpeg;base64,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'
    });
    // Verificando el resultado obtenido
    if (result != null) {
      // Verificando si el usuario ya existe
      if (result.code == 2) {
        this.gService.getToastCtrl('Usuario existente', `El correo ${this.signup_form.value.email} ya esta registrado, intentelo con otro correo.`, 'top', 'danger', 5000);
        return;
      }
      // Si el usuario existe, guardamos la informacion en el storage
      this.gService.saveInfoUser(result);
      // Mostramos la pagina principal
      this.gService.getToastCtrl('Usuario registrado', 'El registro de usuario ha sido exitoso.', 'bottom', 'success', 5000);
      this.router.navigateByUrl('/home');
    }
  }

  /**
   * changePage
   */
  changePage(type: string = 'next') {
    if (type == 'next') {
      // Validando que los datos esten llenos correctamente
      console.log(this.signup_form.value, this.signup_form.valid)
      // Solo si el formulario es valido
      if (this.signup_form.valid) this.slides.slideNext();
      else alert('Tienes que llenar todos los campos');
      // Terminando el codigo hasta aqui
      return;
    }
    // Back
    this.slides.slidePrev();
  }

}
