import { Component,OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import  { MatDialog } from '@angular/material/dialog';
import { ModalEnvioComponent } from '../../Modales/modal-envio/modal-envio.component';
import { ProductoService } from 'src/app/Services/producto.service';
import { Usuario } from 'src/app/Interfaces/usuario';
import { Envio } from 'src/app/Interfaces/envio';

import { EnvioService } from 'src/app/Services/envio.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit,AfterViewInit{

  columnasTabla:string[] = ['numFactura','nomCliente','dirEnvio','estado','acciones'];
  dataInicio:Envio[]=[];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;


    
  constructor(
    private dialog: MatDialog,
    private _envioServicio:EnvioService,
    private _utilidadServicio:UtilidadService
  ){}

  obtenerEnvios(){
    this._envioServicio.lista().subscribe({
      next: (data) => {
        if(data.status){
          console.log(data.value)
          this.dataListaUsuarios.data = data.value;
        }else{
          this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops!")
        }
      }
    })
  }
  
  ngOnInit(): void {
    this.obtenerEnvios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }
  editarEnvio(envio:Envio){
    console.log("AQUI ES EL EDITAR_USUARIO: " + envio)
    this.dialog.open(ModalEnvioComponent, {
      disableClose:true,
      data:envio
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerEnvios();
    });
  }
  // mostrarProducto(producto:Producto):string{
  //   return producto.nombre;
  // }

  // productoParaVenta(event:any){
  //   this.productoSeleccionado = event.option.value;
  // }

  // agregarProductoParaVenta(){
  //   const _cantidad:number = this.formularioProductoVenta.value.cantidad;
  //   const _precio:number = (this.productoSeleccionado.precio);
  //   const _total:number = _cantidad * _precio;
  //   this.totalPagar = this.totalPagar + _total;

  //   this.listaProductosParaVenta.push({
  //     idProducto: this.productoSeleccionado.idProducto,
  //     descripcionProducto:this.productoSeleccionado.nombre,
  //     cantidad:_cantidad,
  //     precioTexto:String(_precio.toFixed(2)),
  //     totalTexto:String(_total.toFixed(2))
  //   })

  //   this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  //   this.formularioProductoVenta.patchValue({
  //     producto:'',
  //     cantidad:''
  //   })

  // }

  // eliminarProductoDeVenta(detalle:DetalleVenta){
  //   this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto)
  //   this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto);

  //   this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  // }

  // registrarVenta(){
  //   if(this.listaProductosParaVenta.length > 0){

  //     this.bloquearBotonRegistrar = true;

  //     const request: Venta = {
  //       tipoPago :this.tipoPagoPorDefecto,
  //       totalTexto:String(this.totalPagar.toFixed(2)),
  //       detalleVenta: this.listaProductosParaVenta
  //     }

  //     console.log(request)

  //     this._ventaServicio.registrar(request).subscribe({
  //       next:(response) => {
  //         if(response.status){
  //           this.totalPagar = 0.00;
  //           this.listaProductosParaVenta = [];
  //           this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  //           Swal.fire({
  //             icon:'success',
  //             title: 'Venta Registrada!',
  //             text: `Numero de venta: ${response.value.numeroDocumento}`
  //           })
  //         }else
  //           this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Oops")
  //       },
  //       complete:() =>{
  //         this.bloquearBotonRegistrar = false;
  //       },
  //       error:(e) => {console.log(e)}
        
  //     })
  //   }
  // }

}
