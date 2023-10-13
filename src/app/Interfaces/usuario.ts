export interface Usuario {
    idEmpleado: number;
    nombre: string;
    apellido: string;
    idTipoEmpleado: number;
    rolTipoEmpleado?: string;
    email: string;
    cedula: string;
    salario: number;
    fechaNac: string;
    fechaRegistro?: string;
    direccion: string;
    numTelefono: string;
    idEstadoEmpleado: number;
    estadoEmpleado?: string;
}
