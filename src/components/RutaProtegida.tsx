import { Component } from 'react'
import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '../auth/AuthContext'

interface RutaProtegidaProps {
  location: Location
}

class RutaProtegidaBase extends Component<RutaProtegidaProps> {
  static contextType = AuthContext
  declare context: AuthContextValue

  render() {
    const { user, loading } = this.context

    if (loading) {
      return (
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )
    }

    if (!user) {
      return <Navigate to="/login" replace state={{ from: this.props.location }} />
    }

    return <Outlet />
  }
}

function RutaProtegida() {
  const location = useLocation()
  return <RutaProtegidaBase location={location} />
}

export default RutaProtegida
