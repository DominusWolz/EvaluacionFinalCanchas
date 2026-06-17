# 🏟️ Sistema de Gestión y Reserva de Canchas

Plataforma web full-stack para la administración y agendamiento de recintos deportivos. Este proyecto implementa un flujo transaccional completo, seguridad por roles (RBAC) y manejo centralizado de errores.

## 🚀 Tecnologías Utilizadas
* **Frontend:** React (Vite), React Router, UI con tema oscuro moderno, Fetch API.
* **Backend:** Node.js, Express.js.
* **Base de Datos & ORM:** MySQL, consultas SQL nativas y Sequelize.
* **Seguridad:** JSON Web Tokens (JWT), encriptación con Bcrypt, validación de datos con Joi.

## ⚙️ Instalación y Configuración Local

1. **Clonar el repositorio y entrar a las carpetas:**
   Instala las dependencias tanto en el frontend como en el backend.
   ```bash
   cd backend && npm install
   cd ../client && npm install

2.Configuración de Variables de Entorno (.env en backend):

Fragmento de código
DATABASE_URL=mysql://[usuario]:[contraseña]@localhost:3306/CanchasEV
PORT=3000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=tu_secreto_super_seguro
NODE_ENV=development
RESET_TOKEN_EXP=30m
RESET_TOKEN_BYTES=32

3.Ejecución:

Backend: npm run dev

Frontend: npm run dev (desde la carpeta /client)

🔐 Control de Acceso Basado en Roles (RBAC)
Administrador VIP: La cuenta registrada con el correo pikachu234@gmail.com tiene permisos exclusivos para el CRUD completo de Canchas (gestión de catálogo).

Usuarios Cliente: Tienen acceso al Dashboard de métricas, catálogo de canchas y pueden realizar, visualizar y cancelar sus reservas.

📊 Matriz de Cumplimiento: Requerimientos Generales (GEN)IDRequerimientoEstadoEvidencia / 
Notas de ImplementaciónGEN-01Setup y Estructura✅Estructura frontend/backend separada, scripts npm configurados.
GEN-02Base de Datos✅Modelos migrados en MySQL.
GEN-03Auth Básica✅Registro y Login implementados con encriptación de contraseñas.GEN-04Middleware JWT✅Rutas protegidas vía authenticate.js.
GEN-05Login Operativo✅Autenticación funcional conectada al Frontend.
GEN-06CORS y Entorno✅.env configurado y política CORS habilitada para el front.GEN-07Restablecer contraseña✅Flujo funcional documentado. Modo Dev: El token se imprime en UI y consola para pruebas sin servidor de correos.
GEN-08Manejo de errores JSON✅Middleware errorHandler al final de la cadena de rutas. Retorna estructura estandarizada y oculta stack en Prod.
GEN-09CRUD REST / Pantallas UI✅Eliminación lógica implementada. Interfaz en CanchasCrud.jsx mapea y muestra errores de la API.
GEN-10Validaciones HTTP (Joi)✅Validaciones estrictas. Retorna 422 en datos inválidos y 409 ante conflictos (duplicados/solapamiento).

🏟️ Matriz de Cumplimiento: Requerimientos de Dominio (RQ)
IDRequerimientoEstadoEvidencia / 
Notas de Implementaciónrq-01Modelo: Canchas✅Tabla y modelo de negocio creado.rq-02Modelo: Reservas✅Tabla y modelo de negocio creado con relación a Canchas.rq-03CRUD Principal: Canchas✅API operativa, protegida por middleware isAdmin. Vista CanchasCrud.jsx.
rq-04CRUD Secundario: Reservas✅API operativa. Creación, listado personal y cancelación (ReservacionesCrud.jsx).
rq-05Regla: No solapar reserva✅Backend valida cruce de horarios y retorna HTTP 409, reflejado visualmente en UI.
rq-06Regla: Capacidad máxima➖Omitido estratégicamente según libertad de diseño (foco en estabilidad).
rq-07Filtros y Búsqueda✅Panel principal y vista de reservas permiten filtrar por fecha y idCancha.
rq-08Panel Principal (Dashboard)✅Dashboard.jsx muestra métricas clave (Total Canchas, Reservas Activas, Dinero Invertido).
rq-09Flujo Transaccional✅Formulario integral: Selección de cancha, hora inicio/fin, cálculo de precio y POST de reserva.
rq-10Funcionalidad Avanzada➖Omitido estratégicamente según libertad de diseño.