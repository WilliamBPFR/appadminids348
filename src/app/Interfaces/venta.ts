import { DetalleVenta } from "./detalle-venta"

export interface Venta {
    IdVenta?: number,
    numeroDocumento?: string,
    tipoPago: string,
    totalTexto: string,
    fechaRegistro?: string
    detalleVenta: DetalleVenta[]
}
