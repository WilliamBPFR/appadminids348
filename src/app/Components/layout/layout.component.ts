import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';

import { MenuService } from 'src/app/Services/menu.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import {NavigationService} from 'src/app/Services/navigation.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{

  listaMenus:Menu[] = [];
  correoUsuario:string = '';
  rolUsuario:string = '';

  constructor(
    private router:Router,
    private _menuSevicio: MenuService,
    private _utilidadServicio: UtilidadService,
    private _usuarioService: UsuarioService,
    private navigationService: NavigationService
  ){}

  ngOnInit(): void {
      const usuario = this._utilidadServicio.obtenerSesionUsuario();

    if(usuario != null){
      this._usuarioService.getUserByID().subscribe({
        next:(data) => {
          if(data.status){
            if(data.usuario_logueado){
              this.correoUsuario = data.value.email;
              this.rolUsuario = data.value.rolTipoEmpleado;
            }else{
              this._utilidadServicio.mostrarAlerta("Usuario No Logueado. Por favor inicie sesion","Opps!");
              setTimeout(() => {
                this.router.navigate(['login']);
              }, 2000);
            }
          }
        },
        error:(e) =>{}
      })
    }else{
      this._utilidadServicio.mostrarAlerta("Usuario No Logueado. Por favor inicie sesion","Opps!");
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 2000);
    }

    this.navigationService.getNavigationEvent().subscribe(() => {
      // Ejecuta la función que deseas cada vez que se realice una navegación
      this.miFuncion();
    });
  }

  miFuncion() {
    console.log("AQUI EN EL MI FUNCION")
    this._usuarioService.verificarUtenticado().subscribe({
      next:(data) => {
        if(data.status){
          if(!data.usuario_logueado){
            this._utilidadServicio.mostrarAlerta("Usuario No Logueado. Por favor inicie sesion","Opps!");
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 1000);
          }
        }
      },
      error:(e) =>{
        this._utilidadServicio.mostrarAlerta("Usuario No Logueado. Por favor inicie sesion","Opps!");
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 500);
      }
    })
  }
  cerrarSesion(){
    this._utilidadServicio.eliminarSesionUsuario();
    this.router.navigate(['login'])
  }
}
