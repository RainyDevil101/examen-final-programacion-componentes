import { Component, type ChangeEvent, type SyntheticEvent } from 'react'
import { Navigate, useLocation, type Location } from 'react-router-dom'
import SimpleReactValidator from 'simple-react-validator'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext, type AuthContextValue } from '../auth/AuthContext'

type Modo = 'login' | 'registro'

interface LoginProps {
  location: Location
}

interface LoginState {
  modo: Modo
  email: string
  password: string
  password2: string
  enviando: boolean
  error: string | null
}

const INITIAL_STATE: Omit<LoginState, 'modo'> = {
  email: '',
  password: '',
  password2: '',
  enviando: false,
  error: null,
}

class LoginBase extends Component<LoginProps, LoginState> {
  static contextType = AuthContext
  declare context: AuthContextValue

  private validator: SimpleReactValidator

  constructor(props: LoginProps) {
    super(props)
    this.state = { modo: 'login', ...INITIAL_STATE }
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
        in: 'Las contraseñas no coinciden.',
      },
    })
  }

  cambiarModo = (modo: Modo): void => {
    this.setState({ modo, ...INITIAL_STATE })
    this.validator.hideMessages()
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    this.setState({ [name]: value } as unknown as Pick<LoginState, 'email'>)
  }

  traducirError(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'El email no es válido.'
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con ese email.'
      case 'auth/weak-password':
        return 'La contraseña es muy débil (mínimo 6 caracteres).'
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email o contraseña incorrectos.'
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.'
      default:
        return 'No se pudo completar la operación. Intenta nuevamente.'
    }
  }

  handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!this.validator.allValid()) {
      this.validator.showMessages()
      return
    }

    const { modo, email, password } = this.state
    this.setState({ enviando: true, error: null })

    try {
      if (modo === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: unknown }).code)
          : ''
      this.setState({ enviando: false, error: this.traducirError(code) })
    }
  }

  render() {
    const { user, loading } = this.context
    if (loading) return null
    if (user) {
      const from = (this.props.location.state as { from?: Location } | null)?.from
      const target = from?.pathname && from.pathname !== '/login' ? from.pathname : '/'
      return <Navigate to={target} replace />
    }

    const { modo, email, password, password2, enviando, error } = this.state

    return (
      <div className="container py-5" style={{ maxWidth: '480px' }}>
        <header className="mb-4">
          <h1 className="mb-1">
            {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="text-muted mb-0">
            Autenticación con Firebase (email + contraseña).
          </p>
        </header>

        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link${modo === 'login' ? ' active' : ''}`}
              onClick={() => this.cambiarModo('login')}
            >
              Iniciar sesión
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link${modo === 'registro' ? ' active' : ''}`}
              onClick={() => this.cambiarModo('registro')}
            >
              Crear cuenta
            </button>
          </li>
        </ul>

        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={this.handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="tucorreo@ejemplo.cl"
                  value={email}
                  onChange={this.handleChange}
                  onBlur={() => this.validator.showMessageFor('email')}
                  autoComplete="email"
                />
                {this.validator.message('email', email, 'required|email')}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={this.handleChange}
                  onBlur={() => this.validator.showMessageFor('password')}
                  autoComplete={
                    modo === 'login' ? 'current-password' : 'new-password'
                  }
                />
                {this.validator.message('password', password, 'required|min:6')}
              </div>

              {modo === 'registro' && (
                <div className="mb-3">
                  <label htmlFor="password2" className="form-label">
                    Confirmar contraseña
                  </label>
                  <input
                    id="password2"
                    type="password"
                    name="password2"
                    className="form-control"
                    value={password2}
                    onChange={this.handleChange}
                    onBlur={() => this.validator.showMessageFor('password2')}
                    autoComplete="new-password"
                  />
                  {this.validator.message(
                    'password2',
                    password2,
                    `required|in:${password}`,
                  )}
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={enviando}
              >
                {enviando
                  ? 'Procesando...'
                  : modo === 'login'
                    ? 'Entrar'
                    : 'Crear cuenta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function Login() {
  const location = useLocation()
  return <LoginBase location={location} />
}

export default Login
