import { Link, NavLink, Outlet } from 'react-router-dom'

function Layout() {
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    `nav-link${isActive ? ' active' : ''}`

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Tienda React
          </Link>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/" end className={linkClass}>
                Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/registro" className={linkClass}>
                Registro
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
