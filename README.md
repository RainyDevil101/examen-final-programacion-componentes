# Proyecto Final - Programación de Componentes

Aplicación web + Android que cubre los tres ejercicios del examen
**Stack**: React 19 + TypeScript + Vite, componentes de clase, Bootstrap 5, react-router-dom, simple-react-validator, Firebase (Firestore + Auth + Storage), Cordova

## Para el evaluador

La entrega incluye **dos artefactos**:

1. **Código fuente** (este repo / ZIP). Se levanta con:
   ```bash
   pnpm install
   pnpm dev
   ```
   Abrir http://localhost:5173. Las credenciales de Firebase ya están preconfiguradas para la app móvil, para la web sin reconfigurar Firebase, ver "Notas" al final.

2. **APK Android** (`proyecto-final.apk`, adjunto). Instalación en dispositivo:
   ```bash
   adb install proyecto-final.apk
   ```
   No requiere recompilar nada. Para reconstruirlo desde cero, ver `cordova/README.md`

## Rutas

| Ruta        | Componente             | Protegida | Ejercicio |
| ----------- | ---------------------- | --------- | --------- |
| `/`         | `Padre` + `Hijo`       | No        | 1         |
| `/login`    | `Login`                | No        | 3         |
| `/registro` | `FormularioRegistro`   | Sí        | 2         |
| `/perfil`   | `Perfil`               | Sí        | 3         |

## Cumplimiento del enunciado

### Ej. 1 - Componentes Padre/Hijo
- `Padre.tsx` mantiene `productos` y `carrito` en `this.state`; usa `this.setState(...)` para actualizar
- `Hijo.tsx` recibe `producto` y callback `onAgregar` por props
- Comunicación bidireccional vía props + callback. Listado con `map()`

### Ej. 2 - Formulario + Firestore
- `FormularioRegistro.tsx` validado con `simple-react-validator` (locale `es`, mensajes personalizados, validador custom de teléfono, `showMessageFor` en `onBlur`)
- Persistencia con `addDoc(collection(db, 'registros'), …)` + `serverTimestamp()`

### Ej. 3 - Bootstrap + Auth + Storage + APK
- **Bootstrap 5** en navbar, cards, formularios y alerts
- **Firebase Auth** (email + contraseña): `AuthProvider` (clase) escucha `onAuthStateChanged` y expone el usuario vía Context. `Login.tsx` permite iniciar sesión y crear cuenta. `RutaProtegida.tsx` protege `/registro` y `/perfil`
- **Firebase Storage**: `Perfil.tsx` sube el avatar a `avatars/{uid}.{ext}` y guarda la URL en `usuarios/{uid}` (Firestore) y en `auth.currentUser.photoURL` (`updateProfile`)
- **Cordova/APK**: build de Vite con `base: './'` + `HashRouter` cuando `VITE_CORDOVA=1`; wrapper en `cordova/` con `config.xml`. Instrucciones completas en [`cordova/README.md`](./cordova/README.md)

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm build:cordova
```

## Notas

- **Variables de Firebase**: `.env.example` lista las 6 variables `VITE_FIREBASE_*`. Para correr la web hace falta un proyecto Firebase con Firestore, Authentication (Email/Password) y Storage habilitados. El APK ya las trae compiladas en el bundle
- **Reglas de Storage sugeridas** (cada usuario sólo escribe su avatar):
  ```
  match /avatars/{userId}.{ext} {
    allow read: if true;
    allow write: if request.auth != null && request.auth.uid == userId;
  }
  ```
