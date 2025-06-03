# 🛒 Proyecto FullStack - Integración de pagos

Este es un proyecto FullStack desarrollado con **React + Vite** en el frontend y **NestJS + TypeORM + PostgreSQL** en el backend, con integración a la pasarela de pagos **Wompi** (versión sandbox).

## 🚀 Requisitos

- Node.js v18+
- PostgreSQL (puede ser local o en la nube como RDS)
- Docker (opcional para levantar PostgreSQL)
- Yarn o npm

## 📦 Instalación

### Backend

1. Clonar el repositorio y entrar en el backend:

```bash
   git clone git@github.com:nsochoaga/oferta_w-02-06-2025.git
   cd backend-w
```

2. Instalar dependencias:

```bash
    npm install
```

3. Configurar la base de datos (por defecto PostgreSQL):

4. Crear un archivo .env con las variables necesarias:

   DB_HOST=**\*
   DB_PORT=**
   DB_USERNAME=**_
   DB_PASSWORD=_**
   DB_NAME=\*\*\*

5. Dejar que TypeORM sincronice:

```bash
  npm run start:dev
```

### Frontend

1. Ir al frontend:

```bash
 cd ../frontend-w
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo .env

VITE_API_URL=http://localhost:3000

4. Ejecutar la app:

```bash
npm run dev
```

## 🧪 Pruebas

Pruebas

## 📝 Notas

Usa TailwindCSS para los estilos.

Wompi se integra mediante su widget embebido.

La base de datos está pensada para PostgreSQL.

Toda la lógica de creación de orden y entrega se ejecuta luego de un pago exitoso.

🧑‍💻 Autor
Nicholson Stive Ochoa Garcia
