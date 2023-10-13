import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',

})
export class UsuarioService {
  private urlApi:string = environment.endpoint + "Empleado/"
  constructor(private http:HttpClient,private _cookieService: CookieService) { }

  iniciarSesion(request:Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}LoginUsuario`,request)
  }

  lista():Observable<ResponseApi>{

    return this.http.get<ResponseApi>(`${this.urlApi}ListaEmpleado`)
  }

  guardar(empleadoDTO:Usuario,hash_password:string):Observable<ResponseApi>{
    
    const params = new HttpParams().set('hash_password', hash_password);

    return this.http.put<ResponseApi>(`${this.urlApi}CrearEmpleado`,empleadoDTO,{params});
  }

  editar(empleadoDTO:Usuario,hash_password:string):Observable<ResponseApi>{
    const params = new HttpParams().set('hash_password', hash_password);

    return this.http.put<ResponseApi>(`${this.urlApi}EditarEmpleado`,empleadoDTO,{params})
  }

  getUserByID():Observable<ResponseApi>{
    console.log("AQUI EN EL GETUSERID")
    const token = this._cookieService.get("token_usuario");
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.get<ResponseApi>(`${this.urlApi}ObtenerInfoEmpleado`,{headers:headers})
  }

  verificarUtenticado():Observable<ResponseApi>{
    console.log("AQUI EN EL VerificarUtenticado")
    const token = this._cookieService.get("token_usuario");
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.get<ResponseApi>(`${this.urlApi}VerificarAutenticado`,{headers:headers})
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }

}
