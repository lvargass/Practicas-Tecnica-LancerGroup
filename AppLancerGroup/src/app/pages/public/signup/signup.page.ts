import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
// Native
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signup_form!: FormGroup;
  geolocation: any = {
    latitude: 0.00000,
    longitude: 0.00000
  };
  imageBase64: string | undefined = 'data:image/png;base64,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';

  protected slides: any = {
    isEnd: false,
    isBeginning: true
  };

  constructor(
    private formBuilder: FormBuilder,
    private gService: GeneralService,
    private router: Router
  ) {}

  ionViewDidEnter() {
  }

  ngOnInit() {
    // Configurando el formulario y agregando validaciones
    this.signup_form = this.formBuilder.group({
      first_name: ['LUIYI', Validators.compose([Validators.maxLength(30), Validators.required])],
      last_name: ['VARGAS', Validators.compose([Validators.maxLength(30), Validators.required])],
      email: ['lvargas9715@gmail.com', Validators.compose([Validators.email, Validators.required])],
      phone: ['8092700415', Validators.compose([Validators.maxLength(10), Validators.required])],
      password: ['12345678', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.required])], // debe contener al menos una letra y un numero)
      confirmPassword: ['12345678', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.required])] // debe contener al menos una letra y un numero)
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
  // Native

  getGeolocation() {
    try {
      Geolocation.getCurrentPosition().then(coordinates => {
        console.log('Current position:', coordinates);
        this.geolocation = coordinates.coords;
      }).catch(err => {
        console.log('error: ', err)
      });
      
    } catch (error) {
      console.log('try error: ', error)
    }
  }
  
  /**
   * openCamera
   */
  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 25,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;

    console.log(image, imageUrl);
  
    // Can be set to the src of an image now
    this.imageBase64 = `data:image/${image.format};base64,${image.base64String}`;
  }

  // End NAtive

  /**
   * signUp
   */
  async signUp() {
    try {
      // If email or password empty
      if (this.signup_form.value.email == '' || this.signup_form.value.password == '' || this.signup_form.value.confirmPassword == ''){
        alert('Error: Please fill in all fields');
        return;
      }
      // If passwords do not match
      if (this.signup_form.value.password != this.signup_form.value.confirmPassword) {
        alert('Error: Passwords must match');
        return;
      }
      // Mandando a registrar el usuario General Service
      const result = await this.gService.registerOrSigninUser({
        userEmail: this.signup_form.value.email,
        userPassword: this.signup_form.value.password,
        userName: `${this.signup_form.value.first_name} ${this.signup_form.value.last_name}`,
        userPhoneNumber: this.signup_form.value.phone,
        userProfilePic: this.imageBase64
      });
      // Verificando el resultado obtenido
      if (result != null) {
        // Verificando si el usuario ya existe
        if (result.code == 2) {
          this.gService.getToastCtrl('Usuario existente', `El correo ${this.signup_form.value.email} ya esta registrado, intentelo con otro correo.`, 'top', 'danger', 5000);
          return;
        }
        // Si el usuario existe, guardamos la informacion en el storage
        this.gService.saveInfoUser(result, this.geolocation);
        // Mostramos la pagina principal
        this.gService.getToastCtrl('Usuario registrado', 'El registro de usuario ha sido exitoso.', 'bottom', 'success', 5000);
        this.router.navigateByUrl('/home');
      }
    } catch (error) {
      console.log('error Signup: ', error);
    }
  }

  /**
   * changePage
   */
  changePage(type: string = 'next') {
    if (type == 'next') {
      // Validando que los datos esten llenos correctamente
      // Solo si el formulario es valido
      if (this.signup_form.value.password != this.signup_form.value.confirmPassword) {
        this.gService.getToastCtrl('Formulario incorrecto', 'Las contraseñas no coinciden.', 'bottom', 'danger', 3000);
        return;
      }
      if (this.signup_form.valid) this.slides.slideNext();
      else alert('Tienes que llenar todos los campos del formulario');
      // Terminando el codigo hasta aqui
      return;
    }
    // Back
    this.slides.slidePrev();
  }

}
