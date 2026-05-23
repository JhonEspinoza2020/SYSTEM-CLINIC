# NovaSalud — Arranque en desarrollo (ejecutar desde la raíz del repo)
# Requisitos: JDK 17, Maven, MySQL, Node.js, Python 3

$Root = Split-Path $PSScriptRoot -Parent
Write-Host "=== NovaSalud Dev ===" -ForegroundColor Cyan
Write-Host "Raíz: $Root"
Write-Host ""
Write-Host "1) MySQL debe estar activo en localhost:3306 (clinica_db)"
Write-Host "2) Microservicio IA (nueva ventana):"
Write-Host "   cd '$Root\ia-microservice'"
Write-Host "   pip install -r requirements.txt"
Write-Host "   python -m uvicorn main:app --reload --port 8000"
Write-Host ""
Write-Host "3) Backend Spring Boot (nueva ventana, JDK 17):"
Write-Host "   cd '$Root\backend-springboot'"
Write-Host "   mvn spring-boot:run"
Write-Host "   (usa application-local.properties si existe)"
Write-Host ""
Write-Host "4) Frontend React (nueva ventana):"
Write-Host "   cd '$Root\frontend-react'"
Write-Host "   npm install"
Write-Host "   npm start"
Write-Host ""
Write-Host "Admin: admin@novasalud.com / AdminNova2026!" -ForegroundColor Green
