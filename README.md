# Proyecto Final — PROC0923 Programación de Componentes

Aplicación web única que cubre los tres ejercicios del examen, construida sobre **React 19 + TypeScript + Vite** con componentes de clase, **Bootstrap 5**, **react-router-dom**, **simple-react-validator** y **Firebase (Firestore)**.

## Rutas

| Ruta         | Componente              | Ejercicio | Descripción                                            |
| ------------ | ----------------------- | --------- | ------------------------------------------------------ |
| `/`          | `Padre` + `Hijo`        | 1         | Tienda con lista de productos y carrito                |
| `/registro`  | `FormularioRegistro`    | 2         | Formulario validado que persiste en Cloud Firestore    |


## Cumplimiento del enunciado

### Ejercicio 1 — Componentes y comunicación

- Proyecto React creado con Vite
- **Padre** (`Padre.tsx`) mantiene la lista de productos y el estado del carrito en `this.state`
- **Hijo** (`Hijo.tsx`) renderiza la tarjeta del producto y un botón
- `map()` para listar productos
- Comunicación **padre → hijo** vía props (`producto`, `onAgregar`)
- Comunicación **hijo → padre** vía callback `onAgregar`
- Actualización del carrito con `this.setState({...})`

### Ejercicio 2 — Formulario + Firestore

- Formulario en React (`FormularioRegistro.tsx`)
- `simple-react-validator` configurado en español, con `autoForceUpdate`, mensajes personalizados, validador **custom** para teléfono y `showMessageFor` en `onBlur`
- Conexión a **Firebase** (`initializeApp`) usando variables de entorno
- Persistencia en **Firestore** vía `addDoc(collection(db, 'registros'), { ... })` con `serverTimestamp`

### Ejercicio 3 — Pendiente

- Estilizar con Bootstrap → ya aplicado en Ej.1 y Ej.2
- Firebase Auth + Firebase Storage → por implementar
- Empaquetado APK con Cordova → por implementar

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Habilita **Cloud Firestore** (modo prueba para desarrollo).
3. *Configuración del proyecto* → *Tus apps* → añade una **app web** y copia el objeto `firebaseConfig`.
4. Copia los valores en `.env` (usa `.env.example` como plantilla):

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env  # y completar con tus credenciales
pnpm dev
```

Abrir http://localhost:5173