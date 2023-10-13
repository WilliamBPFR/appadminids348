import { Component, Inject, OnInit } from '@angular/core';

import { AbstractControl,FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
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
  color:string = "#127bdc";
  color2:string = "#127bdc";
  mostrarPrefix = false;
  leftColor: string = '#000000'; // Valor inicial
  listaCategorias:Categoria[] = [];
  selectedFile: any = null;
  currentImageIndex: number = 0; // Variable para rastrear la imagen actual

 // Asegúrate de que coincida con el tipo de tu lista de categorías
 imagenesSeleccionadas: any = [];
  imagenes: File[] = []; 
  base64Data: string[] = [];

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
        idCategoria:['1',Validators.required],
        cant_stock:['',Validators.required],
        precio:['',Validators.required],
        idEstado:['1',Validators.required],
        descripcion:['',Validators.required],
        Size:['',Validators.required],
        descuento:['',Validators.required]        
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

    // Función para capturar el cambio de color
    onColorChange(event: any,trigger: any) {
      console.log("Evento: " + event);
      this.leftColor = event;
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
  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
  nextImage() {
    if (this.currentImageIndex < this.imagenesSeleccionadas.length - 1) {
      this.currentImageIndex++;
    }
  }
  // Esta función se llama cuando una imagen se carga para ajustar su tamaño
onImageLoad(index: number) {
  if (index === this.currentImageIndex) {
    // Aquí puedes ajustar el tamaño de la imagen si es necesario
  }
}
  onFileChange(event: any) {
     const selectedimages = event.target.files;
     this.imagenesSeleccionadas = [];
     for (let i = 0; i < selectedimages.length; i++) {
       const file = selectedimages[i];
  
      // Comprueba si el archivo es una imagen
      if (file.type.startsWith('image/')) {

        const reader = new FileReader(); 
        reader.onload = (e: any) => {
          // Agrega la vista previa de la imagen al arreglo de imágenes
          this.imagenesSeleccionadas.push(e.target.result);
        };
  
        reader.readAsDataURL(file);
      }
    }
      // const reader = new FileReader();
      // reader.onload = (e:any  ) => {
      //    this.base64Data.push(e.target.result);
       
      // };

      // reader.readAsDataURL(this.imagenes[0])
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
    console.log("Colors: ");
    console.log(this.leftColor);
    console.log("Imagenes: ");
    console.log(this.imagenesSeleccionadas)
    if((this.leftColor != null && this.leftColor != undefined && this.leftColor != "") && this.imagenesSeleccionadas.length != 0){
      const _producto: Producto = {
        idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
        nombre: this.formularioProducto.value.nombre,
        idCategoria: this.formularioProducto.value.idCategoria,
        descripcion: this.formularioProducto.value.descripcion,
        cant_stock: this.formularioProducto.value.cant_stock,
        precio: this.formularioProducto.value.precio,
        color: this.leftColor,
        size: this.formularioProducto.value.Size,
        idEstadoProductos: this.formularioProducto.value.idEstado,
        imagenesGuardadas: this.imagenesSeleccionadas,
        descuento: parseFloat(this.formularioProducto.value.descuento),
      };

     
    

      const formData = new FormData();
      //formData.append('IdProducto', (0).toString()); // Convertir el objeto Producto a JSON
      // formData.append('Nombre', _producto.nombre.toString());
      // formData.append('Precio', _producto.precio.toString());
      // formData.append('Descripcion', "Descripcion");
      // formData.append('IdCategoria', _producto.idCategoria.toString());
      // formData.append('NombreCategoria', _producto.nombreCategoria.toString());
      // formData.append('Color', _producto.color.toString());
      // formData.append('Size', _producto.size.toString());
      // formData.append('Descuento', (1).toString());
      // formData.append('IdEstadoProductos', _producto.idEstadoProductos.toString());
      // formData.append('NombreEstadoProductos', _producto.idEstadoProductos.toString());
      // formData.append('cant_stock', _producto.cant_stock.toString());
      //formData.append('image', this.base64Data);
      console.log(_producto)
    
      // Agregar imágenes al FormData
      

      console.log(formData)
      if(this.datosProducto == null){
        this._productoServicio.guardar(_producto).subscribe({
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
        this._productoServicio.editar(_producto).subscribe({
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

     } else{
      this._utilidadServicio.mostrarAlerta("Debe seleccionar un color e imagenes","Opps!")
     }
  }
}
