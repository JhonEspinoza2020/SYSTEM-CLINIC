# NovaSalud — Sistema Clínico Interoperable

Monorepo con tres servicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `backend-springboot` | 8080 | API REST + JWT + WebSocket |
| `frontend-react` | 3000 | Interfaz web React |
| `ia-microservice` | 8000 | Evaluación de riesgo clínico (FastAPI) |

## Requisitos

- **Java 17** (obligatorio; Java 8 no sirve para Spring Boot 3) — ver [docs/SETUP-JDK17.md](docs/SETUP-JDK17.md)
- Maven
- Node.js 18+
- MySQL 8
- Python 3.10+

## Configuración

### Backend

1. Copia `backend-springboot/application-local.properties.example` a `application-local.properties`
2. Configura MySQL, Gmail y JWT
3. Ejecuta con variables de entorno o archivo local:

```bash
cd backend-springboot
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.config.additional-location=application-local.properties"
```

**Admin por defecto** (creado al iniciar si no existe):
- Email: `admin@novasalud.com` (configurable con `ADMIN_EMAIL`)
- Password: `AdminNova2026!` (configurable con `ADMIN_PASSWORD`)

### Frontend

```bash
cd frontend-react
cp .env.example .env
npm install
npm start
```

### Microservicio IA

```bash
cd ia-microservice
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Arquitectura

El backend sigue **arquitectura hexagonal**:

```
Controller → UseCase → Port → Adapter → JPA
```

Capas implementadas para: **Pacientes**, **Auth**, **Citas**.

## Seguridad

- Autenticación JWT (Bearer token en cada petición)
- Contraseñas con BCrypt (migración automática desde texto plano)
- Rutas protegidas por rol: ADMIN, DOCTOR, PACIENTE
- OTP de recuperación con expiración (15 min)
- Notificaciones WebSocket emitidas desde el servidor

## Arranque rápido

```powershell
.\scripts\start-dev.ps1
```

Guía paso a paso en pantalla. Archivos locales ya preparados:

- `backend-springboot/application-local.properties` (MySQL, admin, JWT)
- `frontend-react/.env` (URLs API)

## Orden de arranque

1. MySQL
2. Microservicio IA (`uvicorn`)
3. Backend Spring Boot (JDK 17)
4. Frontend React

**Probar login:** `.\scripts\test-login.ps1` → admin@novasalud.com / AdminNova2026!
