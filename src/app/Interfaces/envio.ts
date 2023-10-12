export interface Envio {
    idEnvio:number,
    idCliente:number,
    nombreCliente?:string,
    idFactura: number,
    direccionEnvio:string,
    idEstadoEnvio:number,
    descripcionEstadoEnvio?:string,
    telefono:string,
    correo: string,
}
