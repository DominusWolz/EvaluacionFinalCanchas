# EvaluacionFinalCanchas
Proyecto Final de Programacion Web
Backend en Node.js + Express + MySQL para la gestión de usuarios, canchas y reservaciones.  
Actualmente implementa la estructura del proyecto, **models**, **controllers**, **routes** y los endpoints **GET** (listar y obtener por id).  
Los endpoints de creación/actualización/eliminación aún no se han probado con Postman.

---

## 📂 Estructura del proyecto

/EVALUACIONFINALCANCHAS
├─ migrations/01_creacionTabla.sql   # Script SQL para crear BD y tablas
├─ src/
│   ├─ controllers/                  # Lógica de negocio
│   │   ├─ usuarios.controller.js
│   │   ├─ canchas.controller.js
│   │   └─ reservaciones.controller.js
│   ├─ models/                       # Consultas a la BD
│   │   ├─ usuarios.model.js
│   │   ├─ canchas.model.js
│   │   └─ reservaciones.model.js
│   └─ routes/                       # Definición de endpoints
│       ├─ usuarios.routes.js
│       ├─ canchas.routes.js
│       └─ reservaciones.routes.js
├─ app.js                            # Servidor Express
├─ db.js                             # Conexión MySQL
├─ .env.example                      # Variables de entorno
├─ package.json
└─ README.md

Código

---

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/DominusWolz/EvaluacionFinalCanchas.git
   cd EvaluacionFinalCanchas
Instalar dependencias:

bash
npm install
Configurar variables de entorno en .env (ejemplo):

Código
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=CanchasEV
DB_PORT=3306
CORS_ORIGIN=http://localhost:5173
Crear la base de datos y tablas:

bash
mysql -u root -p < migrations/01_creacionTabla.sql
Ejecutar servidor:

bash
npm run dev
El servidor quedará disponible en http://localhost:3000.

🚀 Endpoints disponibles (GET)
Usuarios
GET /api/v1/usuarios → Lista todos los usuarios.

GET /api/v1/usuarios/:id → Obtiene un usuario por su idUsuario.

Canchas
GET /api/v1/canchas → Lista todas las canchas.

GET /api/v1/canchas/:id → Obtiene una cancha por su idCancha.

Reservaciones
GET /api/v1/reservaciones → Lista todas las reservaciones (con nombre de usuario y cancha).

GET /api/v1/reservaciones/:id → Obtiene una reservación por su idReserva.

Healthcheck
GET /api/v1/health → Verifica que el servidor esté corriendo.

🧪 Pruebas rápidas
Ejemplo con curl:

bash
curl http://localhost:3000/api/v1/usuarios
curl http://localhost:3000/api/v1/canchas/1
curl http://localhost:3000/api/v1/reservaciones
Ejemplo con Postman:

Crear colección ReservaCanchas.

Añadir request GET http://localhost:3000/api/v1/usuarios.

Añadir request GET http://localhost:3000/api/v1/canchas.

Añadir request GET http://localhost:3000/api/v1/reservaciones.

📌 Estado actual
[x] Estructura de carpetas (MVC).

[x] Models, controllers y routes.

[x] Endpoints GET funcionando.

[ ] Endpoints POST/PUT/DELETE (pendiente).

[ ] Pruebas completas en Postman (pendiente).

✅ Próximos pasos
Implementar endpoints POST/PUT/DELETE.

Probar todos los endpoints con Postman y documentar ejemplos de request/response.

Añadir validaciones y autenticación (JWT).

Crear seeders para datos de prueba.