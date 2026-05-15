# Proyecto Final — PROC0923 Programación de Componentes

Aplicación web única que cubre los tres ejercicios del examen, construida sobre **React 19 + TypeScript + Vite** con componentes de clase, **Bootstrap 5**, **react-router-dom**, **simple-react-validator** y **Firebase (Firestore)**.

## Rutas

| Ruta         | Componente              | Ejercicio | Descripción                                            |
| ------------ | ----------------------- | --------- | ------------------------------------------------------ |
| `/`          | `Padre` + `Hijo`        | 1         | Tienda con lista de productos y carrito                |
| `/registro`  | `FormularioRegistro`    | 2         | Formulario validado que persiste en Cloud Firestore    |

## Estructura

```
src/
├── components/
│   ├── Layout.tsx                   # Navbar Bootstrap + <Outlet />
│   ├── Padre.tsx                    # [Ej.1] Lista de productos + carrito (this.state)
│   ├── Hijo.tsx                     # [Ej.1] Card de producto + botón
│   └── FormularioRegistro.tsx       # [Ej.2] Form con validator y Firestore
├── types/
│   └── simple-react-validator.d.ts  # Tipos locales (la lib no trae oficiales)
├── types.ts                         # Tipos del dominio (Producto, ItemCarrito)
├── firebase.ts                      # initializeApp + getFirestore (lee VITE_FIREBASE_*)
├── App.tsx                          # BrowserRouter + Routes
└── main.tsx                         # Entry + import de Bootstrap
```

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

5. Reglas mínimas de Firestore:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /registros/{doc} {
         allow create: if true;
       }
     }
   }
   ```

   > Cuando se implemente Firebase Auth (Ej.3) se restringirá esto a usuarios autenticados.

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env  # y completar con tus credenciales
pnpm dev
```

Abrir http://localhost:5173

### Scripts

```bash
pnpm build     # tsc + vite build
pnpm preview   # servir el build
pnpm lint      # ESLint
```

## Validaciones del formulario

| Campo    | Reglas                                                                       |
| -------- | ---------------------------------------------------------------------------- |
| nombre   | required, min 3, max 60 caracteres                                           |
| email    | required, email                                                              |
| telefono | required, validador custom (8–15 dígitos, acepta `+`, espacios, `-`, `(`, `)`, `.`) |
| edad     | required, numeric, 18 ≤ n ≤ 120                                              |
| mensaje  | required, min 10, max 500 caracteres                                         |

> El validador `phone` por defecto exige formato US (10 dígitos agrupados); por eso se reemplaza por uno custom que acepta números chilenos como `97731726` o `+56 9 7773 1726`.

## Stack

- React 19 + TypeScript (componentes de clase)
- Vite
- Bootstrap 5
- react-router-dom 7
- simple-react-validator
- Firebase 12 (Firestore)
- pnpm
