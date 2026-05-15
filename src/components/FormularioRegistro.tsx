import { Component, type ChangeEvent, type SyntheticEvent } from 'react'
import SimpleReactValidator from 'simple-react-validator'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

interface FormState {
  nombre: string
  email: string
  telefono: string
  edad: string
  mensaje: string
}

interface FormStatus {
  type: 'success' | 'error' | null
  message: string
}

interface FormularioRegistroState extends FormState {
  enviando: boolean
  status: FormStatus
}

const INITIAL_FIELDS: FormState = {
  nombre: '',
  email: '',
  telefono: '',
  edad: '',
  mensaje: '',
}

class FormularioRegistro extends Component<
  Record<string, never>,
  FormularioRegistroState
> {
  private validator: SimpleReactValidator

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      ...INITIAL_FIELDS,
      enviando: false,
      status: { type: null, message: '' },
    }
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      locale: 'es',
      element: (message: string) => (
        <div className="text-danger small mt-1">{message}</div>
      ),
      messages: {
        required: 'Este campo es obligatorio.',
        email: 'Ingresa un email válido.',
        min: 'Debe tener al menos :min caracteres.',
        max: 'No puede superar los :max caracteres.',
        numeric: 'Debe ser un número.',
      },
      validators: {
        telefono: {
          message: 'Ingresa un teléfono válido (8 a 15 dígitos).',
          rule: (val) => {
            const limpio = String(val).replace(/[\s\-().]/g, '')
            return /^\+?\d{8,15}$/.test(limpio)
          },
        },
      },
    })
  }

  handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target
    this.setState({ [name]: value } as unknown as Pick<
      FormularioRegistroState,
      keyof FormState
    >)
  }

  resetForm(): void {
    this.setState({ ...INITIAL_FIELDS })
    this.validator.hideMessages()
    Object.keys(INITIAL_FIELDS).forEach((field) =>
      this.validator.hideMessageFor(field),
    )
  }

  handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!this.validator.allValid()) {
      this.validator.showMessages()
      this.setState({
        status: {
          type: 'error',
          message: 'Revisa los campos marcados antes de enviar.',
        },
      })
      return
    }

    this.setState({ enviando: true, status: { type: null, message: '' } })

    try {
      const { nombre, email, telefono, edad, mensaje } = this.state
      await addDoc(collection(db, 'registros'), {
        nombre,
        email,
        telefono,
        edad: Number(edad),
        mensaje,
        creadoEn: serverTimestamp(),
      })

      this.resetForm()
      this.setState({
        enviando: false,
        status: {
          type: 'success',
          message: '¡Registro guardado correctamente en Firestore!',
        },
      })
    } catch (error) {
      const detalle = error instanceof Error ? error.message : 'Error desconocido'
      this.setState({
        enviando: false,
        status: {
          type: 'error',
          message: `No se pudo guardar el registro: ${detalle}`,
        },
      })
    }
  }

  render() {
    const { nombre, email, telefono, edad, mensaje, enviando, status } =
      this.state

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            className="form-control"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={this.handleChange}
            onBlur={() => this.validator.showMessageFor('nombre')}
          />
          {this.validator.message('nombre', nombre, 'required|min:3|max:60')}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-control"
            placeholder="Ej: juan.perez@correo.cl"
            value={email}
            onChange={this.handleChange}
            onBlur={() => this.validator.showMessageFor('email')}
          />
          {this.validator.message('email', email, 'required|email')}
        </div>

        <div className="row">
          <div className="col-md-7 mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              className="form-control"
              placeholder="Ej: 912345678"
              value={telefono}
              onChange={this.handleChange}
              onBlur={() => this.validator.showMessageFor('telefono')}
            />
            {this.validator.message('telefono', telefono, 'required|telefono')}
          </div>

          <div className="col-md-5 mb-3">
            <label htmlFor="edad" className="form-label">
              Edad
            </label>
            <input
              id="edad"
              type="number"
              name="edad"
              className="form-control"
              placeholder="Ej: 25"
              value={edad}
              onChange={this.handleChange}
              onBlur={() => this.validator.showMessageFor('edad')}
            />
            {this.validator.message('edad', edad, 'required|numeric|min:18,num|max:120,num')}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            className="form-control"
            rows={4}
            placeholder="Escribe tu mensaje aquí (mínimo 10 caracteres)"
            value={mensaje}
            onChange={this.handleChange}
            onBlur={() => this.validator.showMessageFor('mensaje')}
          />
          {this.validator.message('mensaje', mensaje, 'required|min:10|max:500')}
        </div>

        {status.type && (
          <div
            className={`alert ${
              status.type === 'success' ? 'alert-success' : 'alert-danger'
            }`}
            role="alert"
          >
            {status.message}
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando}
          >
            {enviando ? 'Guardando...' : 'Enviar registro'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => this.resetForm()}
            disabled={enviando}
          >
            Limpiar
          </button>
        </div>
      </form>
    )
  }
}

export default FormularioRegistro
