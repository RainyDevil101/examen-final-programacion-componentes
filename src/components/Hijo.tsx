import { Component } from 'react'
import type { Producto } from '../types'

interface HijoProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

class Hijo extends Component<HijoProps> {
  handleClick = (): void => {
    const { producto, onAgregar } = this.props
    onAgregar(producto)
  }

  render() {
    const { producto } = this.props

    return (
      <div className="col-12 col-sm-6 col-lg-4 mb-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text text-muted">{producto.descripcion}</p>
            <p className="card-text fs-5 fw-bold mt-auto">
              ${producto.precio.toLocaleString('es-CL')}
            </p>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={this.handleClick}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Hijo
