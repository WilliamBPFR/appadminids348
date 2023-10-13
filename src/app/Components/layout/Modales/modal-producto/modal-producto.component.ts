import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';

import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { raceWith } from 'rxjs';
import { FileValidator } from 'ngx-material-file-input';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {
  formularioProducto:FormGroup;
  // ocultarPassword:boolean =true;
  tituloAccion: string = "Agregar";
  botonAccion:string="Guardar";
  listaCategorias:Categoria[] = [];
  selectedFile: any = null;
 // Asegúrate de que coincida con el tipo de tu lista de categorías
  imagenes: File[] = []; 

  //images: FileList;

  constructor(private modalActual:MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaServicio:CategoriaService,
    private _productoServicio:ProductoService,
    private _utilidadServicio:UtilidadService
    ){
    
      this.formularioProducto = this.fb.group({
        nombre:['',Validators.required],
        idCategoria:['',Validators.required],
        cant_stock:['',Validators.required],
        precio:['',Validators.required],
        idEstadoProductos:['1',Validators.required],
        color:['',Validators.required],
        size:['',Validators.required],
        imagenes:[null]
        
      });

      if(this.datosProducto != null){
        this.tituloAccion="Editar";
        this.botonAccion = "Actualizar"
      }

      this._categoriaServicio.lista().subscribe({
        next: (data) => {
          console.log(data.status)
          console.log(data.value)
          if(data.status)
                this.listaCategorias = data.value;
        },
        error: (e)=>{console.log(e);}
      })
      
      
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.imagenes = Array.from(files);
    }
  }

  ngOnInit(): void {
    if(this.datosProducto != null){

      this.formularioProducto.patchValue({
         nombre: this.datosProducto.nombre,
         idCategoria: this.datosProducto.idCategoria,
         cant_stock: this.datosProducto.cant_stock,
         precio: this.datosProducto.precio,
         color: this.datosProducto.color,
          size:this.datosProducto.size,
        esActivo:this.datosProducto.idEstadoProductos
      })
    }

    
  }

  

  guardarEditar_Producto(){

    
      const _producto: Producto = {
        idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
        nombre: this.formularioProducto.value.nombre,
        idCategoria: this.formularioProducto.value.idCategoria,
        nombreCategoria: "",
        cant_stock: this.formularioProducto.value.cant_stock,
        precio: this.formularioProducto.value.precio,
        color: this.formularioProducto.value.color,
         size: this.formularioProducto.value.size,
        idEstadoProductos: parseInt(this.formularioProducto.value.idEstadoProductos)
      };

     
    

    const formData = new FormData();
    formData.append('IdProducto', (0).toString()); // Convertir el objeto Producto a JSON
    formData.append('Nombre', _producto.nombre.toString());
    formData.append('Precio', _producto.precio.toString());
    formData.append('Descripcion', "Descripcion");
    formData.append('IdCategoria', _producto.idCategoria.toString());
    formData.append('NombreCategoria', _producto.nombreCategoria.toString());
    formData.append('Color', _producto.color.toString());
    formData.append('Size', _producto.size.toString());
    formData.append('Descuento', (1).toString());
    formData.append('IdEstadoProductos', _producto.idEstadoProductos.toString());
    formData.append('NombreEstadoProductos', _producto.idEstadoProductos.toString());
    formData.append('cant_stock', _producto.cant_stock.toString());
   
    // Agregar imágenes al FormData
    for (let i = 0; i < this.imagenes.length; i++) {
      formData.append('image', this.imagenes[i]);
    }
console.log(formData)
    if(this.datosProducto == null){
      this._productoServicio.guardar(formData).subscribe({
        next: (data) => {
          console.log(data.status);
          console.log(data.msg);
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue registrado","Exito");
            this .modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el producto","Error");

          }
          
        },
        error: ()=> {
          this._utilidadServicio.mostrarAlerta("Error encontrado ","Opps!")
          
        }
      })
    }else{
      this._productoServicio.editar(formData).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El producto fue editado","Exito");
            this .modalActual.close("true")
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el producto","Error");

          }
          
        },
        error: ()=> {
          this._utilidadServicio.mostrarAlerta("Error encontrado ","Opps!")
          
        }
      })
    }

    
  }
}
