# Crea N pacientes vía API REST (Episodio 3 - data masiva)
# Uso: .\scripts\seed-pacientes-masivos.ps1 -Cantidad 50
param(
    [int]$Cantidad = 50,
    [string]$ApiBase = "http://localhost:8080",
    [string]$DoctorEmail = "doctor.cypress@novasalud.com",
    [string]$DoctorPassword = "DoctorCypress2026!"
)

$ErrorActionPreference = "Stop"

Write-Host "=== Seed pacientes masivos ($Cantidad) ===" -ForegroundColor Cyan

$loginBody = @{ correo = $DoctorEmail; password = $DoctorPassword } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$ApiBase/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $login.token
$doctorId = $login.usuario.id
$headers = @{ Authorization = "Bearer $token" }

$nombres = @("Luis", "Ana", "Carlos", "Elena", "Pedro", "Sofia", "Miguel", "Lucia", "Jorge", "Rosa")
$apellidos = @("Garcia", "Lopez", "Martinez", "Rodriguez", "Hernandez", "Torres", "Flores", "Ramirez", "Vargas", "Castro")

$creados = 0
for ($i = 1; $i -le $Cantidad; $i++) {
    $dni = (10000000 + $i).ToString()
    if ($dni.Length -gt 8) { $dni = $dni.Substring(0, 8) }
    $nombre = $nombres[$i % $nombres.Length]
    $ap = $apellidos[$i % $apellidos.Length]
    $fecha = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $hc = "HC-SEED-$i"

    $paciente = @{
        id = [guid]::NewGuid().ToString()
        nombre = $nombre
        apellidoPaterno = $ap
        apellidoMaterno = "Seed"
        dni = $dni
        edad = 20 + ($i % 60)
        sexo = if ($i % 2 -eq 0) { "Femenino" } else { "Masculino" }
        tipoSangre = "O+"
        alergiasConocidas = if ($i % 10 -eq 0) { "Penicilina" } else { "Ninguna" }
        numeroCama = $i % 100
        historiaClinica = "$hc | Medicina General -> Temp: 36.5°C"
        fechaRegistro = $fecha
        idDoctor = $doctorId
        temperatura = 36.5
    }

    try {
        $body = $paciente | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$ApiBase/api/pacientes" -Method Post -Headers $headers -Body $body -ContentType "application/json" | Out-Null
        $creados++
        if ($i % 10 -eq 0) { Write-Host "  $i / $Cantidad ..." }
    } catch {
        Write-Warning "DNI $dni omitido (posible duplicado): $($_.Exception.Message)"
    }
}

Write-Host "Listo: $creados pacientes creados para doctor $DoctorEmail" -ForegroundColor Green
