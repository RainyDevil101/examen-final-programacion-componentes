import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Padre from './components/Padre'
import FormularioRegistro from './components/FormularioRegistro'

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Padre />} />
          <Route path="/registro" element={<PaginaRegistro />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
