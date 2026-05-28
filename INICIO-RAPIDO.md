# Inicio rápido — NovaSalud

## Orden de arranque

1. **XAMPP** → Start **MySQL**
2. **IA** → `.\scripts\start-ia.ps1`
3. **Backend** → Run `ClinicaApplication.java` (▶ en el IDE)
4. **Frontend** → `npm start` (desde la raíz del proyecto)

## Credenciales admin

- `admin@novasalud.com` / `AdminNova2026!`

## Base de datos (Flyway)

El esquema se gestiona con **Flyway** (`db/migration/`). Hibernate solo valida (`ddl-auto=validate`).

Si ya tenías tablas creadas por Hibernate antes:
- Flyway hará *baseline* automático y aplicará `V2` para columnas de signos vitales si faltan.

## Microservicio IA (evaluación de riesgo)

`.\scripts\start-ia.ps1` — evalúa riesgo por datos clínicos (edad, alergias, signos vitales).

## Panel del doctor

Tras login, menú lateral: **Citas** · **Registrar paciente** · **Pacientes y análisis IA** · **Mi perfil**

## Pruebas Cypress (video / episodios)

Ver [docs/PRUEBAS-CYPRESS.md](docs/PRUEBAS-CYPRESS.md)

```powershell
cd frontend-react
npm run cypress:open
# o con reporte HTML:
npm run cypress:run:report
```

Data masiva: `.\scripts\seed-pacientes-masivos.ps1 -Cantidad 50`

## Tests backend (opcional)
