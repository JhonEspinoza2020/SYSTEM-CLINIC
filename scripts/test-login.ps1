# Prueba rápida del endpoint de login (backend debe estar en 8080)
$body = @{
    correo = "admin@novasalud.com"
    password = "AdminNova2026!"
} | ConvertTo-Json

try {
    $r = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    if ($r.token) {
        Write-Host "OK Login — Token recibido" -ForegroundColor Green
        Write-Host "Rol: $($r.usuario.rol)"
    } else {
        Write-Host "Respuesta sin token:" -ForegroundColor Yellow
        $r | ConvertTo-Json
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "¿Backend corriendo en puerto 8080?"
}
