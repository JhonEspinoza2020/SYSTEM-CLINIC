# Microservicio IA — NovaSalud (puerto 8000)
$Root = Split-Path $PSScriptRoot -Parent
Set-Location "$Root\ia-microservice"

$Puerto = 8000

Write-Host "Instalando dependencias Python..." -ForegroundColor Cyan
pip install -r requirements.txt

$enUso = Get-NetTCPConnection -LocalPort $Puerto -State Listen -ErrorAction SilentlyContinue
if ($enUso) {
    $pidLibre = ($enUso | Select-Object -First 1).OwningProcess
    $proc = Get-Process -Id $pidLibre -ErrorAction SilentlyContinue
    Write-Host ""
    Write-Host "El puerto $Puerto ya esta en uso (PID $pidLibre - $($proc.ProcessName))." -ForegroundColor Yellow
    Write-Host "La IA probablemente ya esta corriendo: http://127.0.0.1:$Puerto" -ForegroundColor Green
    Write-Host "Para reiniciar: taskkill /PID $pidLibre /F  y luego .\scripts\start-ia.ps1" -ForegroundColor Cyan
    exit 0
}

Write-Host "Iniciando IA en http://127.0.0.1:$Puerto ..." -ForegroundColor Green
python -m uvicorn main:app --reload --host 127.0.0.1 --port $Puerto
