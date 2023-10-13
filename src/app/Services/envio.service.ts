import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Envio } from '../Interfaces/envio';



@Injectable({
  providedIn: 'root'
})
export class EnvioService {
  private urlApi:string = environment.endpoint + "Envio/";

  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{

    return this.http.get<ResponseApi>(`${this.urlApi}ListaEnvios`)
  }

  actualizar_envios(envio:Envio):Observable<ResponseApi>{

    return this.http.put<ResponseApi>(`${this.urlApi}ActualizarEstadoEnvio`,envio)
  }
}
