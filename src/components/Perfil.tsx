import { Component, type ChangeEvent } from 'react'
import { updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, db, storage } from '../firebase'
import { AuthContext, type AuthContextValue } from '../auth/AuthContext'

interface PerfilState {
  archivo: File | null
  preview: string | null
  subiendo: boolean
  mensaje: { type: 'success' | 'error'; text: string } | null
}

const MAX_BYTES = 2 * 1024 * 1024

class Perfil extends Component<Record<string, never>, PerfilState> {
  static contextType = AuthContext
  declare context: AuthContextValue

  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      archivo: null,
      preview: null,
      subiendo: false,
      mensaje: null,
    }
  }

  componentWillUnmount(): void {
    if (this.state.preview) URL.revokeObjectURL(this.state.preview)
  }

  handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null
    if (this.state.preview) URL.revokeObjectURL(this.state.preview)

    if (!file) {
      this.setState({ archivo: null, preview: null, mensaje: null })
      return
    }

    if (!file.type.startsWith('image/')) {
      this.setState({
        archivo: null,
        preview: null,
        mensaje: { type: 'error', text: 'El archivo debe ser una imagen.' },
      })
      return
    }

    if (file.size > MAX_BYTES) {
      this.setState({
        archivo: null,
        preview: null,
        mensaje: { type: 'error', text: 'La imagen no puede superar 2 MB.' },
      })
      return
    }

    this.setState({
      archivo: file,
      preview: URL.createObjectURL(file),
      mensaje: null,
    })
  }

  handleSubir = async (): Promise<void> => {
    const { user } = this.context
    const { archivo } = this.state
    if (!user || !archivo) return

    this.setState({ subiendo: true, mensaje: null })

    try {
      const extension = archivo.name.split('.').pop() ?? 'jpg'
      const refAvatar = ref(storage, `avatars/${user.uid}.${extension}`)
      await uploadBytes(refAvatar, archivo)
      const url = await getDownloadURL(refAvatar)

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url })
      }

      await setDoc(
        doc(db, 'usuarios', user.uid),
        {
          uid: user.uid,
          email: user.email,
          photoURL: url,
          actualizadoEn: serverTimestamp(),
        },
        { merge: true },
      )

      this.setState({
        subiendo: false,
        archivo: null,
        preview: null,
        mensaje: { type: 'success', text: 'Avatar actualizado correctamente.' },
      })
    } catch (err) {
      const detalle = err instanceof Error ? err.message : 'Error desconocido'
      this.setState({
        subiendo: false,
        mensaje: { type: 'error', text: `No se pudo subir la imagen: ${detalle}` },
      })
    }
  }

  render() {
    const { user } = this.context
    const { archivo, preview, subiendo, mensaje } = this.state
    const avatarActual = preview ?? user?.photoURL ?? null

    return (
      <div className="container py-5" style={{ maxWidth: '560px' }}>
        <header className="mb-4">
          <h1 className="mb-1">Mi perfil</h1>
          <p className="text-muted mb-0">
            Sube tu foto de avatar a Firebase Storage.
          </p>
        </header>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-4">
              {avatarActual ? (
                <img
                  src={avatarActual}
                  alt="Avatar"
                  className="rounded-circle border"
                  style={{ width: 96, height: 96, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                  style={{ width: 96, height: 96, fontSize: '2rem' }}
                >
                  {user?.email?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div>
                <div className="fw-semibold">{user?.email}</div>
                <small className="text-muted">UID: {user?.uid}</small>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="avatar" className="form-label">
                Selecciona una imagen (máx. 2 MB)
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="form-control"
                onChange={this.handleFile}
                disabled={subiendo}
              />
            </div>

            {mensaje && (
              <div
                className={`alert ${
                  mensaje.type === 'success' ? 'alert-success' : 'alert-danger'
                }`}
                role="alert"
              >
                {mensaje.text}
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary"
              disabled={!archivo || subiendo}
              onClick={this.handleSubir}
            >
              {subiendo ? 'Subiendo...' : 'Subir avatar'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Perfil
