import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar:MatSnackBar, private _cookieServicio:CookieService) { }

  mostrarAlerta(mensaje:string, tipo:string){
    this._snackBar.open(mensaje,tipo,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    })

    
  }

  guardarSesionUsuario(token:string){
    console.log("GUARDADOO");
    if(this._cookieServicio.check("token_usuario")){
      this._cookieServicio.delete("token_usuario");
    }
    this._cookieServicio.set("token_usuario", token);
  }

  obtenerSesionUsuario(){
    console.log("OBTENIDO00000")
    const dataCadena = this._cookieServicio.get("token_usuario");
    console.log(dataCadena);
    return dataCadena;
  }

  eliminarSesionUsuario(){
    if(this._cookieServicio.check("token_usuario")){
      this._cookieServicio.delete("token_usuario");
    }
  }
}
