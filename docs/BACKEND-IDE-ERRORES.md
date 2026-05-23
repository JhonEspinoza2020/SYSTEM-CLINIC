# Por qué el backend muestra muchos errores en rojo (Problems)

Si ves **100+ problemas** en `entities`, `test`, `security`, etc., casi siempre es el **editor**, no que el proyecto esté roto.

## Causa habitual

El **Java Language Server** no cargó el classpath de Maven. Entonces no reconoce:

- `org.springframework.*`
- `jakarta.persistence.*`
- `org.junit.*`
- Lombok (`@Getter`, `@Builder`)

Cada import sin resolver genera varios errores → suman **161 problems** fácilmente.

## Por qué pasa en tu PC

1. **Java 8 en el PATH** del sistema, pero el proyecto necesita **Java 17**.
2. **Maven (`mvn`) no está instalado** → el IDE no descarga dependencias solo.
3. El `pom.xml` está en `backend-springboot/`, no en la raíz del repo.
4. Ruta JDK incorrecta en configuración antigua (ya corregida).

Si **Run** en `ClinicaApplication.java` funciona, el código está bien; solo falta configurar el IDE.

## Solución (5 minutos)

### 1. Instalar extensiones en Cursor

- **Extension Pack for Java** (Microsoft)
- **Spring Boot Extension Pack** (opcional, ayuda mucho)

### 2. Configurar Java 17

`Ctrl+Shift+P` → **Java: Configure Java Runtime**

- Selecciona **Java 17** (Eclipse Temurin / JDK 17).
- Márcalo como **default** para este workspace.

Si no aparece, instala JDK 17 y vuelve a abrir Cursor.

### 3. Importar Maven

`Ctrl+Shift+P` → **Java: Clean Java Language Server Workspace** → Reload

Luego espera a que termine **"Importing Maven project"** (barra inferior).

### 4. Abrir la carpeta correcta (recomendado)

Opción A: Abrir solo el backend:

```
File → Open Folder → backend-springboot
```

Opción B: Quedarte en la raíz y esperar a que importe `backend-springboot/pom.xml`.

### 5. Verificar

Abre `AuthIntegrationTest.java`:

- No debe marcar en rojo `MockMvc`, `Test`, `MediaType`.
- En **JAVA PROJECTS** (panel lateral) debe aparecer `clinica` con dependencias Maven.

## Carpeta `target/`

Los `.class` en `target/` **no son errores de código**. Son compilados. Puedes ignorarlos o borrar `target` y recompilar.

## Tests en rojo sin Maven

Los tests en `src/test/java/com/clinica/integration/` son válidos. El IDE los marca mal si no cargó `spring-boot-starter-test` y `h2`.

Para ejecutarlos: clic derecho en la clase → **Run Tests** (con Java 17).

## Resumen

| Síntoma | Significado real |
|---------|------------------|
| 161 problems | Classpath del IDE vacío |
| entities en rojo | No encuentra JPA/Lombok |
| test en rojo | No encuentra JUnit/Spring Test |
| La app sí arranca | El código compila al ejecutar |

No hace falta borrar `entities` ni los tests: hay que **configurar Java 17 + importar Maven** en Cursor.
