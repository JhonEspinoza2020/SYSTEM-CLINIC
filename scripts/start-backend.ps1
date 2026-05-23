# Backend Spring Boot — requiere JDK 17 y Maven (o usar Run en el IDE)
$Root = Split-Path $PSScriptRoot -Parent
Set-Location "$Root\backend-springboot"

# Ajusta esta ruta si tu JDK 17 está en otro lugar
$Jdk17 = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.7-hotspot"
if (-not (Test-Path "$Jdk17\bin\java.exe")) {
    $Jdk17 = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}

if ($Jdk17 -and (Test-Path "$Jdk17\bin\java.exe")) {
    $env:JAVA_HOME = $Jdk17
    $env:Path = "$Jdk17\bin;" + ($env:Path -split ';' | Where-Object { $_ -notmatch 'Java\\jre|javapath' }) -join ';'
    Write-Host "JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Cyan
    java -version
} else {
    Write-Host "ADVERTENCIA: No se encontró JDK 17. Configura JAVA_HOME manualmente." -ForegroundColor Yellow
}

$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if (-not $mvnCmd) {
    Write-Host ""
    Write-Host "Maven (mvn) no está en el PATH." -ForegroundColor Red
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "  1) Instalar Maven: https://maven.apache.org/download.cgi"
    Write-Host "  2) En Cursor/IntelliJ: abrir ClinicaApplication.java -> Run (botón play)"
    Write-Host "  3) Agregar Maven al PATH y volver a ejecutar este script"
    exit 1
}

Write-Host "Iniciando backend en http://localhost:8080 ..." -ForegroundColor Green
mvn spring-boot:run
