import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

   formularioLogin:FormGroup; // poder jugar con el formulario, logica de validacion y obtener valor
  ocultarPassword:boolean = true; 
  mostrarLoading:boolean = false;

  constructor(
    private fb:FormBuilder,
    private router:Router,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ){
    this.formularioLogin = this.fb.group({
      email:['',Validators.required], //Hacer campos requeridos en el LogIn
      password:['',Validators.required]
    });

  }

  iniciarSesion(){
    this.mostrarLoading = true;

    const request:Login = { //Obtener en la variable request los valores de los input del LogIn
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }


    //Usando el servicio y la api para iniciar sesion
    this._usuarioService.iniciarSesion(request).subscribe({
      next:(data) => {
        if(data.status){
          this._utilidadService.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"]) //Navegando a otra pagina si todo sale bien
        }
        else{
          this._utilidadService.mostrarAlerta("Usuario Invalido","Opps!") //Mostrando alerta por si todo sale mal
        }

      },
      complete: ()=>{
        this.mostrarLoading = false;
      },
      error: ()=> {
        this._utilidadService.mostrarAlerta("Error encontrado ","Opps!")
        this.mostrarLoading = false;
      }

    });
  }

}
