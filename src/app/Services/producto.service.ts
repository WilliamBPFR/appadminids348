import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Producto } from '../Interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlApi:string = environment.endpoint + "Product/"

  constructor(private http:HttpClient) { }

  lista():Observable<ResponseApi>{

    return this.http.get<ResponseApi>(`${this.urlApi}ListaProducto`)
  }

  guardar(productoDTO:Producto):Observable<ResponseApi>{
    console.log("LLAMADA API:")
    console.log(productoDTO)
    return this.http.put<ResponseApi>(`${this.urlApi}CrearProducto`,productoDTO)
  }

  editar(request:Producto):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}EditarProducto`,request)
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
