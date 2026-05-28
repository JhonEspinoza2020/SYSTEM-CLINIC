# Pruebas E2E con Cypress (videos por episodio)

## Requisitos previos

1. MySQL activo
2. Backend en `http://localhost:8080` (reiniciar tras actualizar código para usuarios Cypress)
3. IA en `http://localhost:8000` (`.\scripts\start-ia.ps1`)
4. Frontend en `http://localhost:3000`

## Usuarios de prueba (se crean al arrancar el backend)

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Admin | admin@novasalud.com | AdminNova2026! |
| Doctor | doctor.cypress@novasalud.com | DoctorCypress2026! |
| Paciente | paciente.cypress@novasalud.com | PacienteCypress2026! |

## Instalación

```powershell
cd frontend-react
npm install
```

## Episodios y specs

| Episodio | Archivo Cypress |
|----------|-----------------|
| 1 PMV1 funcional | `01-pmv1-login-admin.cy.js`, `02-pmv1-paciente-crud.cy.js` |
| 2 PMV2 funcional | `03-pmv2-citas-ia.cy.js` |
| 3 Data masiva | `04-pmv3-data-masiva.cy.js` + seed |
| 4 Métricas | `05-pmv4-metricas.cy.js` |
| 5 ML | `03-pmv2-citas-ia.cy.js` (API IA) + `ia-microservice/tests/` |

## Data masiva (antes del episodio 3)

```powershell
.\scripts\seed-pacientes-masivos.ps1 -Cantidad 50
```

## Ejecutar pruebas

```powershell
cd frontend-react
npm run cypress:open
```

Modo headless + reporte HTML:

```powershell
npm run cypress:run:report
```

Reporte en: `frontend-react/cypress/reports/index.html`

## Pruebas Python IA (episodio 5)

```powershell
cd ia-microservice
pip install -r requirements.txt pytest httpx
pytest tests/ -v
```
