export interface Producto {
    idProducto: number;
    nombre: string;
    idCategoria: number;
    nombreCategoria?: string;
    descripcion: string;
    cant_stock: number;
    precio: number;
    descuento?: number;
    idEstadoProductos: number;
    nombreEstadoProductos?: string;
    color:string;
    size:string;
    imagenesGuardadas: [];
}
