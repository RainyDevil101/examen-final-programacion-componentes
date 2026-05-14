# Ejercicio 1 — Tienda React (Padre / Hijo)

Aplicación React + TypeScript que implementa una tienda con carrito usando **componentes de clase**, comunicación **padre-hijo** vía props y **hijo-padre** vía callbacks.

## Stack

- React 19 + TypeScript
- Vite
- Bootstrap 5
- pnpm

## Estructura

```
src/
├── components/
│   ├── Padre.tsx   # Lista de productos + carrito (estado en this.state)
│   └── Hijo.tsx    # Tarjeta de producto + botón "Agregar al carrito"
├── types.ts        # Tipos Producto e ItemCarrito
├── App.tsx         # Monta <Padre />
└── main.tsx        # Entry point + import de Bootstrap
```

## Requerimientos cubiertos del enunciado

- Proyecto React creado con Vite
- Componente **Padre** que mantiene la lista de productos y el estado del carrito
- Componente **Hijo** que renderiza un producto y el botón
- `map()` para listar productos en el padre
- Comunicación **padre → hijo** mediante `props` (`producto`, `onAgregar`)
- Comunicación **hijo → padre** mediante el callback `onAgregar`
- Actualización del carrito con `state` y `this.setState({...})`

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```

Abrir http://localhost:5173

### Otros scripts

```bash
pnpm build     # build de producción
pnpm preview   # servir el build
pnpm lint      # ESLint
```
