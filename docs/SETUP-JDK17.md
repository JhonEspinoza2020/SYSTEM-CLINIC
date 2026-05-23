# Instalar JDK 17 para el backend

El proyecto Spring Boot 3 requiere **Java 17**. En tu equipo el PATH apunta a Java 8 (`1.8.0_51`), por eso `mvn spring-boot:run` puede fallar.

## Opción A — Eclipse Temurin (recomendado)

1. Descarga JDK 17: https://adoptium.net/temurin/releases/?version=17
2. Instala y anota la ruta, por ejemplo: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot`
3. En PowerShell (sesión actual):

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.13.11-hotspot"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
java -version
```

Debe mostrar `17.x`.

### 4. Arranca el backend

**Opción A — Script (PowerShell):**
```powershell
.\scripts\start-backend.ps1
```

**Opción B — IDE (si `mvn` no está instalado):**
Abre `ClinicaApplication.java` → clic derecho → **Run Java**.

**Opción C — Maven manual:**
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.7-hotspot"
cd backend-springboot
mvn spring-boot:run
```

### Microservicio IA

```powershell
.\scripts\start-ia.ps1
```

O manualmente:
```powershell
cd ia-microservice
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## Opción B — IntelliJ / VS Code

Configura el **Project SDK / Java Runtime** en **17** para el módulo `backend-springboot` y ejecuta `ClinicaApplication` desde el IDE.

## Verificar login

Con el backend en marcha:

```powershell
.\scripts\test-login.ps1
```
