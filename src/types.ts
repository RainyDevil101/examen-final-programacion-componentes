export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
}

export interface ItemCarrito extends Producto {
  cantidad: number
}
