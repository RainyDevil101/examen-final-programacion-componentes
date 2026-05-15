import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import Layout from './components/Layout'
import Padre from './components/Padre'
import FormularioRegistro from './components/FormularioRegistro'
import Login from './components/Login'
import Perfil from './components/Perfil'
import RutaProtegida from './components/RutaProtegida'

function PaginaRegistro() {
  return (
    <div className="container py-5" style={{ maxWidth: '720px' }}>
      <header className="mb-4">
        <h1 className="mb-1">Registro</h1>
        <p className="text-muted mb-0">
          Formulario validado con <code>simple-react-validator</code> que
          persiste en Firestore.
        </p>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <FormularioRegistro />
        </div>
      </div>
    </div>
  )
}

// HashRouter for the Cordova/APK build (file:// has no real history API);
// BrowserRouter for the regular web build.
const Router = import.meta.env.VITE_CORDOVA ? HashRouter : BrowserRouter

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Padre />} />
            <Route path="/login" element={<Login />} />
            <Route element={<RutaProtegida />}>
              <Route path="/registro" element={<PaginaRegistro />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
