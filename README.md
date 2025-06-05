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

   DB\*HOST=**\*
   DB_PORT=**
   DB_USERNAME=\*\**
   DB*PASSWORD=\*\*\*
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

## 🚀 Despliegue en AWS (Frontend + Backend)

### 🧩 Backend (NestJS + PostgreSQL en RDS + ECS con Fargate)

1.  Base de datos en RDS:

    - Motor: PostgreSQL
    - Host: db-w-offer.ct04uoky6y1z.us-east-2.rds.amazonaws.com
    - Usuario: postgres_w
    - Contraseña: mysecretpass
    - Puerto: 5432
    - Base de datos: w_db

2.  Dockerización del backend:

    - Se creó una imagen Docker del proyecto NestJS con Dockerfile.

    - Se generó una imagen en Amazon ECR con un pipeline automático.

3.  ECS con Fargate:

    - Se creó un cluster en ECS.

    - Se definió una task definition con Fargate y se usó la imagen del repositorio ECR.

    - El servicio del backend fue levantado con tipo REPLICA.

4.  Load Balancer:

    - Se configuró un Application Load Balancer público.

    - El servicio ECS fue vinculado al Load Balancer para recibir tráfico en el puerto 80.

    - Se asignó una IP pública y subredes públicas (VPC).

5.  Variables de entorno en ECS:

    - Las variables .env necesarias como:

    ```bash
    DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, PORT
    ```

    - se definieron directamente en la configuración del servicio ECS.

6.  Conexión exitosa:

    - El backend quedó expuesto públicamente con la url:

    ```bash
    http://backend-w-alb-689693603.us-east-2.elb.amazonaws.com
    ```

### 🎨 Frontend (React + Vite + TailwindCSS)

1. Build de producción:

   - Se ejecutó:

   ```bash
   npm run build
   ```

   - El resultado (dist/) fue subido a un bucket S3 público con hosting estático habilitado.

2. Configuración del bucket S3:

   - Se habilitó el hosting estático.

   - Se subieron los archivos desde la carpeta dist/.

   - El archivo index.html fue configurado como documento de inicio.

   - El bucket quedó expuesto en una URL pública como:

   ```bash
   http://frontend-w.s3-website-us-east-2.amazonaws.com
   ```

3. Redirección de pagos con Wompi:

   - Se actualizó el archivo .env en el frontend con la redirección correcta:

   ```bash
   VITE_REDIRECT_URL=http://frontend-w.s3-website-us-east-2.amazonaws.com/payment-result
   ```

   - Luego se volvió a ejecutar npm run build y se subió nuevamente el contenido a S3.
