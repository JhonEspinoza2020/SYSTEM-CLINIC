# CONTEXTO GENERAL DEL SISTEMA - PARA CONFIGURACIÓN EN CURSOR AI

Este documento contiene el diseño de arquitectura, estructura de carpetas, flujos de datos y responsabilidades de cada componente del **Sistema Inteligente de Gestión de Historias Clínicas Interoperables**. Está estructurado específicamente para servir como base de contexto (`Prompt Context`) en el editor de código **Cursor AI**.

---

## 1. DESCRIPCIÓN GENERAL DEL PROYECTO
* **Nombre del Proyecto:** Sistema Inteligente de Gestión de Historias Clínicas Interoperables (Basado en el estándar HL7/FHIR).
* **Objetivo:** Optimizar la integración, disponibilidad y seguridad del intercambio de historias clínicas entre establecimientos de salud de la Región Junín (Año 2026).
* **Enfoque Arquitectónico:** Arquitectura Hexagonal (Puertos y Adaptadores) en el Backend para garantizar total desacoplamiento entre las reglas del dominio clínico y la infraestructura (Base de datos, Framework web, servicios de mensajería).
* **Tecnologías Emergentes:** Microservicio de Inteligencia Artificial (Machine Learning - Aprendizaje Supervisado) para asistencia diagnóstica mediante procesamiento de imágenes médicas.

---

## 2. STACK TECNOLÓGICO
* **Back-end Principal:** Java 17 / Spring Boot 3.x
  * *Seguridad:* Spring Security con autenticación basada en tokens JWT.
  * *Persistencia:* Spring Data JPA / Hibernate conectado a MySQL.
  * *Interoperabilidad:* WebSockets (Protocolo STOMP + SockJS) para notificaciones asíncronas en tiempo real.
  * *Mensajería:* JavaMailSender para el envío de códigos OTP de recuperación de cuentas.
* **Front-end:** React.js (JavaScript / Tailwind CSS)
  * *Comunicación:* Axios para el consumo de la API REST del backend.
* **Microservicio de IA:** Python 3.x (FastAPI o Flask para la API REST interna).
  * *Modelos:* Scikit-learn / TensorFlow (Modelos de Clasificación Supervisada con precisión del 90%).
* **Base de Datos:** MySQL Server.

---

## 3. MAPA COMPLETO DE ARQUITECTURA (ESTRUCTURA DE CARPETAS)

La raíz del espacio de trabajo de Cursor se divide en tres dominios independientes:

```text
SYSTEM-CLINIC/
│
├── backend-springboot/              # NÚCLEO DE LA APLICACIÓN (JAVA)
│   ├── pom.xml                      # Gestión de dependencias Maven
│   └── src/main/java/com/clinica/
│       ├── ClinicaApplication.java   # Clase Principal (Motor Spring Boot)
│       │
│       ├── domain/                  # CAPA DE DOMINIO (Pura - Sin dependencias de frameworks)
│       │   ├── entities/            # Modelos del Corazón Clínico
│       │   │   ├── Usuario.java     # Entidad pura de usuario (id, email, password, rol, estado)
│       │   │   ├── Paciente.java    # Entidad pura de paciente
│       │   │   └── HistoriaClinica.java
│       │   └── ports/               # Interfaces (Contratos puros del sistema)
│       │       ├── PacienteRepositoryPort.java        # Puerto de Salida para persistencia
│       │       └── HistoriaClinicaRepositoryPort.java  # Puerto de Salida para historias
│       │
│       ├── application/             # CAPA DE APLICACIÓN (Casos de Uso del negocio)
│       │   ├── useCases/            # Definición formal de las acciones de negocio
│       │   │   └── GestionarPacienteUseCase.java
│       │   └── services/            # Implementación orquestadora de los casos de uso
│       │       └── PacienteServiceImpl.java
│       │
│       └── infrastructure/          # CAPA DE INFRAESTRUCTURA (Detalles tecnológicos)
│           ├── config/              # Configuraciones del Framework
│           │   ├── SecurityConfig.java     # Configuración de Filtros Web y JWT
│           │   └── WebSocketConfig.java    # Configuración de canales STOMP en tiempo real
│           ├── input/controllers/   # Adaptadores de Entrada (Endpoints de la API)
│           │   ├── AuthController.java     # Endpoints /api/auth/* (Login, Registro, OTP Correo)
│           │   └── PacienteController.java # Endpoints /api/pacientes/* (CRUD Clínico)
│           ├── output/entities/     # Entidades de Base de Datos (Decoradas con @Entity JPA)
│           │   ├── UsuarioJpaEntity.java
│           │   └── PacienteJpaEntity.java
│           ├── output/repositories/ # Interfaces extendidas de JpaRepository (Spring Data)
│           │   ├── UsuarioCrudRepository.java
│           │   └── PacienteCrudRepository.java
│           └── adapters/            # Adaptadores de Salida (Implementación de los puertos)
│               └── PacienteRepositoryAdapter.java  # Une PacienteRepositoryPort con PacienteCrudRepository
│
├── frontend-react/                  # INTERFAZ DE USUARIO Web (REACT)
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── services/
│       │   └── PacienteService.js   # Cliente HTTP Axios mapeado hacia el Backend
│       └── components/              # Vistas y Formularios
│           ├── Login.jsx            # Vista de autenticación segura
│           ├── RegistroDoctor.jsx   # Formulario de autoregistro médico (Estado inicial: PENDIENTE)
│           ├── PerfilDoctor.jsx     # Dashboard del profesional
│           ├── FormularioPaciente.jsx
│           └── ListaPacientes.jsx   # Listado dinámico con filtros clínicos
│
└── ia-microservice/                 # MICROSERVICIO DE INTELIGENCIA ARTIFICIAL (PYTHON)
    └── main.py                      # API REST del modelo de Machine Learning (Clasificación/90% accuracy)

    4. FLUJO TÉCNICO Y SEPARACIÓN DE RESPONSABILIDADES (SRP)
Para programar o refactorizar código dentro de esta estructura, se debe respetar estrictamente el flujo de inversión de dependencias:

Adaptador de Entrada (Infraestructura): El cliente envía una petición HTTP a PacienteController. El controlador extrae el cuerpo de la solicitud y los parámetros. No procesa lógica de negocio.

Inyección del Caso de Uso (Aplicación): PacienteController invoca al contrato definido en GestionarPacienteUseCase. La inyección se hace mediante constructores, nunca acoplada a clases concretas.

Orquestación de Servicios (Aplicación): PacienteServiceImpl procesa las reglas del sistema (por ejemplo: validar que un DNI no esté duplicado o interactuar con el microservicio de IA).

Puerto de Salida (Dominio): Si el servicio necesita persistir o consultar datos, llama a la interfaz PacienteRepositoryPort. El servicio desconoce si los datos se guardan en MySQL, PostgreSQL o memoria.

Adaptador de Salida (Infraestructura): La clase PacienteRepositoryAdapter implementa PacienteRepositoryPort. Dentro de ella, se realiza el mapeo de objetos del dominio (Paciente) a objetos ORM (PacienteJpaEntity) y delega la persistencia final a PacienteCrudRepository (Spring Data JPA).

5. REGLAS CRÍTICAS DE NEGOCIO IMPLEMENTADAS (MANTENER EN NUEVAS REFRACTORIZACIONES)
Control de Estados en el Registro: Cuando un paciente se registra, su estado inicial es ACTIVO. Cuando un doctor se registra mediante RegistroDoctor.jsx, su estado inicial se almacena como PENDIENTE en la base de datos hasta que el Administrador valide sus credenciales médicas.

Seguridad y Criptografía: Ninguna contraseña se almacena en texto plano. Se procesan a través de los filtros de hashing de SecurityConfig.java. El endpoint /login es el único habilitado de forma pública para la emisión de tokens JWT.

Recuperación por Canal OTP (Gmail): El flujo en AuthController maneja un estado efímero en memoria para el código aleatorio de 6 dígitos enviado por el servidor SMTP. El cambio de contraseña solo se habilita si el endpoint de validación retorna un estado exitoso.

Aislamiento del Microservicio de IA: El script en ia-microservice/main.py procesa los vectores o arrays numéricos de las imágenes clínicas y retorna una estructura JSON clara ({prediction: string, accuracy: float}). El backend consume este servicio mediante llamadas REST internas (RestTemplate/WebClient) manteniendo aislada la carga computacional de la IA.

6. INSTRUCCIONES PARA EL CONTEXTO EN CURSOR AI
Cuando utilices la barra de comandos o chat de Cursor (Ctrl + L o Ctrl + K), haz referencia a este archivo con el símbolo @ (ejemplo: @contexto-sistema-clinico.md) y añade las siguientes directrices operativas:

"Cualquier controlador nuevo debe inyectar interfaces de Casos de Uso del directorio application/useCases/ y nunca interactuar de forma directa con los repositorios JPA."

"Las clases dentro de domain/entities/ deben mantenerse limpias de anotaciones de frameworks como @Entity, @Table, @Id o cualquier librería de Spring Framework."

"Garantiza la trazabilidad completa entre los componentes de entrada en React (PacienteService.js) y las firmas de métodos declaradas en los controladores REST de Spring Boot."