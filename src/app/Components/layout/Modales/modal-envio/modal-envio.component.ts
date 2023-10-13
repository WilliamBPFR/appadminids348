import { Component, Inject, OnInit } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Envio } from 'src/app/Interfaces/envio';
import { estadosEnvio } from 'src/app/Interfaces/estadosEnvios';


import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import {EstadoService} from 'src/app/Services/estados.service'
import {EnvioService} from 'src/app/Services/envio.service'

export const MY_DATA_FORMATS = {
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
  }

@Component({
  selector: 'app-modal-envio',
  templateUrl: './modal-envio.component.html',
  styleUrls: ['./modal-envio.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class ModalEnvioComponent implements OnInit{

  formularioUsuario:FormGroup;
  ocultarPassword:boolean =true;
  ocultarPassword2:boolean =true;
  entrado:boolean =true;
  tituloAccion: string = "Agregar";
  botonAccion:string="Guardar";
  listaEstadosEnvios:estadosEnvio[] = [];
  mostrarPrefix = false;
  fechaActual = new Date().getTime();
  editando:boolean = false;
  idEnvio:number = 0;
  idEstado:number = 0;
  cambioEstado:boolean = false;

  constructor(private modalActual:MatDialogRef<ModalEnvioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosEnvio: Envio,
    private fb: FormBuilder,
    private _estadoServicio:EstadoService,
    private _envioServicio:EnvioService,
    private _utilidadServicio:UtilidadService
    ){
      if(this.datosEnvio != null){
        this.editando = true;
      }
      this.formularioUsuario = this.fb.group({
        idFact:['',Validators.required],
        idCliente:['',Validators.required],
        correo:['',Validators.required],
        telefono:['',Validators.required],
        direccion:['',[Validators.required]],
        estado: ['',Validators.required],
        idEstados:['',Validators.required],
        nombre:['',Validators.required],

      });

      if(this.datosEnvio != null){
        this.tituloAccion="Editar";
        this.botonAccion = "Actualizar"
      }

      this._estadoServicio.lista_envios().subscribe({
        next: (data) => {
          if(data.status)
                this.listaEstadosEnvios = data.value;
        },
        error: (e)=>{console.log(e);}
      });
  }

  ngOnInit(): void {
    console.log("DATOS USUARIO: ");
    console.log(this.datosEnvio);
    if(this.datosEnvio != null){
      this.formularioUsuario.patchValue({
        idFact:this.datosEnvio.idFactura,
        idCliente:this.datosEnvio.idCliente,
        correo:this.datosEnvio.correo,
        telefono:this.datosEnvio.telefono,
        direccion:this.datosEnvio.direccionEnvio,
        estado: this.datosEnvio.idEstadoEnvio,
        idEstados:this.datosEnvio.idEstadoEnvio,
        nombre:this.datosEnvio.nombreCliente,
      })
      this.idEnvio=this.datosEnvio.idEnvio;
      this.idEstado=this.datosEnvio.idEstadoEnvio;
    }
  }


  ActualizarEstado(){
    const _envio:Envio ={
      idEnvio: this.datosEnvio.idEnvio,
      idCliente: this.formularioUsuario.value.idCliente,
      idFactura: this.formularioUsuario.value.idFact,
      direccionEnvio: this.formularioUsuario.value.direccion,
      idEstadoEnvio: this.formularioUsuario.value.idEstados,
      telefono: this.formularioUsuario.value.telefono,
      correo: this.formularioUsuario.value.correo,
    }

    if(this.datosEnvio.idEstadoEnvio !=this.formularioUsuario.value.idEstados){
        this._envioServicio.actualizar_envios(_envio).subscribe({
          next: (data) => {
            if(data.status){
              if(data.value){
                this._utilidadServicio.mostrarAlerta("El estado del envio se modificó con exito","Exito");
                this.modalActual.close("true");
              }else{
                this._utilidadServicio.mostrarAlerta("No se pudo modificar el estado del envio","Error");
              }
          }
        },
          error: ()=> {
            this._utilidadServicio.mostrarAlerta("Error encontrado ","Opps!") 
          }
      });
    }else{
      this._utilidadServicio.mostrarAlerta("El estado del envío es el mismo. Seleccione uno diferente e inténtelo de nuevo","Error");
    }
  }
}


