import { Component } from 'react'
import { Link, NavLink, Outlet, useNavigate, type NavigateFunction } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '../auth/AuthContext'

interface LayoutBaseProps {
  navigate: NavigateFunction
}

class LayoutBase extends Component<LayoutBaseProps> {
  static contextType = AuthContext
  declare context: AuthContextValue

  linkClass = ({ isActive }: { isActive: boolean }): string =>
    `nav-link${isActive ? ' active' : ''}`

  handleLogout = async (): Promise<void> => {
    await this.context.logout()
    this.props.navigate('/login', { replace: true })
  }

  render() {
    const { user, loading } = this.context

    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link to="/" className="navbar-brand">
              Tienda React
            </Link>
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <NavLink to="/" end className={this.linkClass}>
                  Productos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/registro" className={this.linkClass}>
                  Registro
                </NavLink>
              </li>
              {!loading && user && (
                <li className="nav-item">
                  <NavLink to="/perfil" className={this.linkClass}>
                    Perfil
                  </NavLink>
                </li>
              )}
              {!loading &&
                (user ? (
                  <>
                    <li className="nav-item text-light small ms-lg-3 me-lg-2">
                      {user.email}
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className="btn btn-outline-light btn-sm"
                        onClick={this.handleLogout}
                      >
                        Salir
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item ms-lg-2">
                    <NavLink to="/login" className="btn btn-outline-light btn-sm">
                      Iniciar sesión
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        </nav>

        <main>
          <Outlet />
        </main>
      </>
    )
  }
}

function Layout() {
  const navigate = useNavigate()
  return <LayoutBase navigate={navigate} />
}

export default Layout
