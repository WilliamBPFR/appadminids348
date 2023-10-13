import { Component, Inject, OnInit } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { estadosEmpleado } from 'src/app/Interfaces/estadosEmpleado';


import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import {EstadoService} from 'src/app/Services/estados.service'

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
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class ModalUsuarioComponent implements OnInit{

  formularioUsuario:FormGroup;
  ocultarPassword:boolean =true;
  ocultarPassword2:boolean =true;
  entrado:boolean =true;
  tituloAccion: string = "Agregar";
  botonAccion:string="Guardar";
  listaRoles:Rol[] = [];
  listaEstados:estadosEmpleado[] = [];
  mostrarPrefix = false;
  fechaActual = new Date().getTime();
  editando:boolean = false;


  constructor(private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio:RolService,
    private _usuarioServicio:UsuarioService,
    private _utilidadServicio:UtilidadService,
    private _estadoServicio:EstadoService
    ){
      if(this.datosUsuario != null){
        this.editando = true;
      }
      this.formularioUsuario = this.fb.group({
        nombre:['',Validators.required],
        apellido:['',Validators.required],
        cedula:['',Validators.required],
        correo:['',Validators.required],
        salario:['',[Validators.required]],
        clave: this.editando == false ? ['',Validators.required] : [''],
        repetir_clave: this.editando == false ? ['',Validators.required] : [''],
        idEstado:['',Validators.required],
        fecha_nac:[String(this.fechaActual),Validators.required],
        idRol:['',Validators.required],
        Direccion: ['',Validators.required],
        telefono: ['',Validators.required]
      });

      if(this.datosUsuario != null){
        this.tituloAccion="Editar";
        this.botonAccion = "Actualizar"
      }

      this._rolServicio.lista().subscribe({
        next: (data) => {
          if(data.status)
                this.listaRoles = data.value;
        },
        error: (e)=>{console.log(e);}
      });

      this._estadoServicio.lista().subscribe({
        next: (data) => {
          console.log("ESTADO CLIENTE: "+data)
          if(data.status)
                this.listaEstados = data.value;
        },
        error: (e)=>{console.log("ESTADO CLIENTE: ");
                      console.log(e);}
      });  
  }

  ngOnInit(): void {
    console.log("DATOS USUARIO: ");
    console.log(this.datosUsuario);
    if(this.datosUsuario != null){
      this.formularioUsuario.patchValue({
        nombre: this.datosUsuario.nombre,
        apellido:this.datosUsuario.apellido,
        cedula:this.datosUsuario.cedula,
        correo:this.datosUsuario.email,
        salario:this.datosUsuario.salario,
        esActivo:this.datosUsuario.idEstadoEmpleado,
        fecha_nac:this.datosUsuario.fechaNac,
        idRol:this.datosUsuario.idTipoEmpleado,
        Direccion: this.datosUsuario.direccion,
        telefono: this.datosUsuario.numTelefono,
        idEstado: this.datosUsuario.idEstadoEmpleado
      })
    }
  }
  
validarSalario(control: AbstractControl | null) {
  if(control != null){
    let salario = control.value;
    if (salario === null || salario === '') {
      return null; // No hacer nada si el campo está vacío
    }

    salario = salario.toString();
    salario = salario.replace(/[^0-9.]/g, '');
    // Utiliza una expresión regular para validar si el valor es un número válido.
    if (/^[0-9.]*$/.test(salario)) {
      // Reemplaza las comas con una cadena vacía para que no interfieran con el punto decimal
      salario = salario.replace(/,/g, '');
      const punto = salario.indexOf('.');
      // Divide el salario en parte entera y parte decimal
      const partes = salario.split('.');
      const parteEntera = partes[0] || '';
      const parteDecimal = partes[1] || '';

      // Agrega comas solo a la parte entera (antes del punto decimal)
      salario = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parteDecimal || punto >=0  ? '.' + parteDecimal : '');

      // Asigna el salario formateado de nuevo al control
      control.setValue(salario, { emitEvent: false });
      return null; // Es un número válido
    } else {
      // Es un número inválido, devuelve un objeto con un error personalizado.
      return { salarioInvalido: true };
    }
  }else{  
    return null;
  }
}

  
  
  
  
  guardarEditar_Usuario(){
    if((this.formularioUsuario.value.clave == this.formularioUsuario.value.repetir_clave) || this.datosUsuario != null){
      console.log("ENTREE")
      const _usuario:Usuario ={
        idEmpleado: this.datosUsuario == null ? 0 : this.datosUsuario.idEmpleado,
        nombre: this.formularioUsuario.value.nombre,
        apellido:this.formularioUsuario.value.apellido,
        cedula:this.formularioUsuario.value.cedula,
        email:this.formularioUsuario.value.correo,
        salario:this.formularioUsuario.value.salario,
        idEstadoEmpleado:this.formularioUsuario.value.idEstado,
        fechaNac:this.formularioUsuario.value.fecha_nac.toString().slice(0,10),
        idTipoEmpleado:this.formularioUsuario.value.idRol,
        direccion: this.formularioUsuario.value.Direccion,
        numTelefono: this.formularioUsuario.value.telefono,
      }

      if(this.datosUsuario == null){
        this._usuarioServicio.guardar(_usuario,this.formularioUsuario.value.clave).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue registrado","Exito");
              this .modalActual.close("true")
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario","Error");

            }
            
          },
          error: ()=> {
            this._utilidadServicio.mostrarAlerta("Error encontrado ","Opps!")
            
          }
        })
      }else{
        console.log("ENTREEE2.0")
        const pass = this.formularioUsuario.value.clave;
        this._usuarioServicio.editar(_usuario,this.formularioUsuario.value.clave).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario fue editado","Exito");
              this .modalActual.close("true")
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario","Error");

            }
            
          },
          error: ()=> {
            this._utilidadServicio.mostrarAlerta("Error encontrado ","Opps!")
            
          }
        })
      }

    
    }else{
      this._utilidadServicio.mostrarAlerta("Las contraseñas no coinciden","Error");
    }
  }
}


