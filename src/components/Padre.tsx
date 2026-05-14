import { Component } from 'react'
import Hijo from './Hijo'
import type { ItemCarrito, Producto } from '../types'

interface PadreState {
  productos: Producto[]
  carrito: ItemCarrito[]
}

class Padre extends Component<Record<string, never>, PadreState> {
  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      productos: [
        {
          id: 1,
          nombre: 'Notebook Lenovo',
          descripcion: 'Notebook 14" Ryzen 5, 8GB RAM, 512GB SSD',
          precio: 549990,
        },
        {
          id: 2,
          nombre: 'Mouse Logitech',
          descripcion: 'Mouse inalámbrico M280',
          precio: 12990,
        },
        {
          id: 3,
          nombre: 'Teclado Mecánico',
          descripcion: 'Teclado RGB switches red',
          precio: 49990,
        },
        {
          id: 4,
          nombre: 'Monitor 24"',
          descripcion: 'Monitor IPS Full HD 75Hz',
          precio: 119990,
        },
        {
          id: 5,
          nombre: 'Audífonos HyperX',
          descripcion: 'Audífonos gamer con micrófono',
          precio: 39990,
        },
        {
          id: 6,
          nombre: 'Webcam Logitech',
          descripcion: 'Webcam C270 HD 720p',
          precio: 24990,
        },
      ],
      carrito: [],
    }
  }

  agregarAlCarrito = (producto: Producto): void => {
    this.setState((prev) => {
      const existente = prev.carrito.find((item) => item.id === producto.id)
      if (existente) {
        return {
          carrito: prev.carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item,
          ),
        }
      }
      return {
        carrito: [...prev.carrito, { ...producto, cantidad: 1 }],
      }
    })
  }

  quitarDelCarrito = (id: number): void => {
    this.setState((prev) => ({
      carrito: prev.carrito.filter((item) => item.id !== id),
    }))
  }

  vaciarCarrito = (): void => {
    this.setState({ carrito: [] })
  }

  calcularTotal(): number {
    return this.state.carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0,
    )
  }

  render() {
    const { productos, carrito } = this.state
    const total = this.calcularTotal()
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

    return (
      <div className="container py-4">
        <header className="mb-4">
          <h1 className="mb-1">Tienda React</h1>
          <p className="text-muted">
            Ejercicio 1 — Componentes Padre / Hijo con comunicación vía props y
            callbacks
          </p>
        </header>

        <div className="row">
          <section className="col-lg-8">
            <h2 className="h4 mb-3">Productos disponibles</h2>
            <div className="row">
              {productos.map((producto) => (
                <Hijo
                  key={producto.id}
                  producto={producto}
                  onAgregar={this.agregarAlCarrito}
                />
              ))}
            </div>
          </section>

          <aside className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h5 mb-0">Carrito</h2>
                  <span className="badge bg-secondary">{totalItems}</span>
                </div>

                {carrito.length === 0 ? (
                  <p className="text-muted mb-0">El carrito está vacío.</p>
                ) : (
                  <>
                    <ul className="list-group list-group-flush mb-3">
                      {carrito.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item d-flex justify-content-between align-items-start px-0"
                        >
                          <div>
                            <div className="fw-semibold">{item.nombre}</div>
                            <small className="text-muted">
                              {item.cantidad} × $
                              {item.precio.toLocaleString('es-CL')}
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => this.quitarDelCarrito(item.id)}
                          >
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="d-flex justify-content-between fw-bold mb-3">
                      <span>Total</span>
                      <span>${total.toLocaleString('es-CL')}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={this.vaciarCarrito}
                    >
                      Vaciar carrito
                    </button>
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }
}

export default Padre
