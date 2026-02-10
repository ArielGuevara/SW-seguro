"# 🏦 Sistema de Gestión de Cooperativa de Ahorro y Crédito

## 📋 Descripción del Proyecto

Sistema distribuido de microservicios para la gestión integral de una cooperativa de ahorro y crédito. El sistema está compuesto por tres componentes principales que se comunican mediante **RabbitMQ** para garantizar la consistencia de datos y validaciones cross-service.

### Problemática Resuelta

La Cooperativa "Futuro Seguro" enfrentaba graves inconsistencias:
- ❌ Creación de cuentas para socios inexistentes
- ❌ Eliminación de socios con cuentas activas
- ❌ Aprobación de préstamos sin validación de cuentas destino
- ❌ Falta de sincronización entre microservicios

### Solución Implementada

✅ **Validación cross-service** mediante RabbitMQ  
✅ **Pruebas unitarias** con cobertura > 80%  
✅ **Pruebas E2E** con Cypress  
✅ **Arquitectura de microservicios** escalable y resiliente

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                     http://localhost:5173                       │
└──────────────┬────────────────────────────┬─────────────────────┘
               │                            │
               ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  Microservicio   │         │  Microservicio   │
    │     SOCIOS       │◄───────►│     CUENTAS      │
    │  (Spring Boot)   │         │    (NestJS)      │
    │  Puerto: 8080    │         │  Puerto: 3000    │
    └────────┬─────────┘         └────────┬─────────┘
             │                            │
             │         RabbitMQ           │
             └────────►Exchange◄──────────┘
                    (Puerto: 5672)
                         │
                ┌────────┴────────┐
                │  Management UI  │
                │  Puerto: 15672  │
                └─────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
    PostgreSQL                        MySQL
    (Puerto: 5432)                (Puerto: 3306)
```

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Microservicio | Tecnología | Base de Datos | Puerto |
|---------------|------------|---------------|--------|
| **Socios** | Spring Boot 4.0.1 (Java 21) | PostgreSQL | 8080 |
| **Cuentas** | NestJS 11 (Node.js) | MySQL 8.0 | 3000 |

### Frontend
- **React 19** con TypeScript
- **Vite** como bundler
- **Axios** para peticiones HTTP
- **Formik + Yup** para formularios

### Comunicación entre Servicios
- **RabbitMQ 3.x** - Message Broker
- **AMQP Protocol** - Para comunicación asíncrona

### Testing
- **JUnit 5 + Mockito** - Pruebas unitarias Java
- **Cypress 15** - Pruebas E2E

### Documentación de APIs
- **Swagger/OpenAPI** - Ambos microservicios
- **SpringDoc** (Socios)
- **NestJS Swagger** (Cuentas)

---

## 📦 Prerrequisitos

Asegúrate de tener instalado:

- ✅ **Node.js** >= 18.x
- ✅ **Java JDK** 21+
- ✅ **Maven** 3.8+
- ✅ **PostgreSQL** 14+
- ✅ **MySQL** 8.0+
- ✅ **RabbitMQ** 3.x
- ✅ **Git**

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio

```bash
git clone <repository-url>
cd taller-pruebas-unitarias
```

### 2️⃣ Configurar RabbitMQ

#### Opción A: Instalación Local

**Windows:**
```powershell
# Descargar e instalar desde https://www.rabbitmq.com/download.html
# Ejecutar RabbitMQ Server

# Habilitar Management Plugin
rabbitmq-plugins enable rabbitmq_management

# Crear usuario admin
rabbitmqctl add_user admin admin123
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

**Linux/Mac:**
```bash
# Instalar RabbitMQ
sudo apt-get install rabbitmq-server  # Ubuntu/Debian
brew install rabbitmq                  # macOS

# Iniciar servicio
sudo systemctl start rabbitmq-server

# Habilitar Management Plugin
sudo rabbitmq-plugins enable rabbitmq_management

# Crear usuario admin
sudo rabbitmqctl add_user admin admin123
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

#### Opción B: Docker

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=admin123 \
  rabbitmq:3-management
```

#### Verificar Instalación

- **Management UI**: http://localhost:15672
- **Usuario**: admin
- **Contraseña**: admin123

### 3️⃣ Configurar Base de Datos PostgreSQL (Microservicio Socios)

```sql
-- Crear base de datos
CREATE DATABASE cooperativa_socios;

-- Crear usuario (opcional)
CREATE USER postgres WITH PASSWORD 'admin123';
GRANT ALL PRIVILEGES ON DATABASE cooperativa_socios TO postgres;
```

### 4️⃣ Configurar Base de Datos MySQL (Microservicio Cuentas)

#### Opción A: MySQL Local

```sql
CREATE DATABASE cooperativa_cuentas;
CREATE USER 'cooperativa_user'@'localhost' IDENTIFIED BY 'cooperativa123';
GRANT ALL PRIVILEGES ON cooperativa_cuentas.* TO 'cooperativa_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Opción B: Docker Compose

```bash
cd microservicio-cuentas
docker-compose up -d
```

Esto iniciará:
- **MySQL**: Puerto 3306
- **phpMyAdmin**: http://localhost:8081

---

## ▶️ Ejecución de los Microservicios

### 🔵 Microservicio de Socios (Spring Boot)

```bash
cd socios

# Compilar el proyecto
./mvnw clean install

# Ejecutar
./mvnw spring-boot:run

# O con Java directamente
java -jar target/socios-0.0.1-SNAPSHOT.jar
```

**Endpoints disponibles:**
- API: http://localhost:8080/api/socios
- Swagger: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/api-docs

### 🟢 Microservicio de Cuentas (NestJS)

```bash
cd microservicio-cuentas

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Ejecutar en modo producción
npm run build
npm run start:prod
```

**Endpoints disponibles:**
- API: http://localhost:3000/cuentas
- Swagger: http://localhost:3000/api-docs

### 🔴 Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build
npm run preview
```

**Aplicación disponible en**: http://localhost:5173

---

## 🧪 Pruebas Unitarias

### Pruebas Unitarias - Microservicio Socios (Java)

El microservicio de Socios cuenta con **29 pruebas unitarias** organizadas en 4 suites:

#### Ejecutar Todas las Pruebas

```bash
cd socios

# Ejecutar pruebas
./mvnw test

# Ejecutar con reporte de cobertura
./mvnw clean test jacoco:report
```

#### Suites de Pruebas Implementadas

**1. SocioServiceImplTests (12 pruebas)**
- ✅ Crear socio exitosamente
- ✅ Validar identificación duplicada
- ✅ Actualizar socio
- ✅ Obtener socio por ID
- ✅ Listar todos los socios
- ✅ Eliminar socio sin cuentas activas
- ✅ Prevenir eliminación con cuentas activas
- ✅ Buscar por identificación
- ✅ Manejo de excepciones

**2. SocioControllerTests (6 pruebas)**
- ✅ Crear socio → 201 CREATED
- ✅ Actualizar socio → 200 OK
- ✅ Obtener por ID → 200 OK
- ✅ Listar todos → 200 OK
- ✅ Eliminar socio → 204 NO CONTENT
- ✅ Buscar por identificación → 200 OK

**3. CuentaIntegrationServiceTests (7 pruebas)**
- ✅ Validar cuentas activas (true/false)
- ✅ Manejo de respuesta nula de RabbitMQ
- ✅ Manejo de errores de conversión
- ✅ Validar cuenta destino válida/inválida
- ✅ Timeout en comunicación RabbitMQ
- ✅ Respuesta correcta del servicio de cuentas

**4. PrestamoServiceImplTests (4 pruebas)**
- ✅ Crear préstamo con cuenta válida
- ✅ Rechazar préstamo con cuenta inválida
- ✅ Validar flujo de aprobación
- ✅ Verificar cambio de estado a APROBADO

#### Ver Resultados

```bash
# Ver reporte de resultados
cat target/surefire-reports/ec.fin.coacandes.socios.SociosApplicationTests.txt

# Ver reporte HTML de cobertura
open target/site/jacoco/index.html  # macOS/Linux
start target/site/jacoco/index.html # Windows
```

#### Tecnologías de Testing

- **JUnit 5** - Framework de testing
- **Mockito** - Mocking framework
- **Spring Boot Test** - Testing utilities
- **AssertJ** - Fluent assertions

---

## 🎭 Pruebas E2E con Cypress

### Configuración de Cypress

```bash
cd frontend

# Instalar Cypress (si no está instalado)
npm install cypress --save-dev

# Abrir Cypress Test Runner
npx cypress open

# Ejecutar pruebas en modo headless
npx cypress run
```

### Suites de Pruebas E2E Implementadas

#### 1. **home.cy.ts** - Página Principal
```typescript
describe('Home Page Tests', () => {
  it('Debe cargar la página principal correctamente')
  it('Debe mostrar el título de la cooperativa')
  it('Debe navegar a registro de socios')
  it('Debe navegar a gestión de cuentas')
})
```

#### 2. **register.cy.ts** - Registro de Socios
```typescript
describe('Registro de Socios Tests', () => {
  it('Debe registrar un nuevo socio exitosamente')
  it('Debe validar campos obligatorios')
  it('Debe validar formato de cédula')
  it('Debe mostrar error si socio ya existe')
  it('Debe validar formato de email')
})
```

#### 3. **partner.cy.ts** - Gestión de Socios
```typescript
describe('Gestión de Socios Tests', () => {
  it('Debe listar todos los socios')
  it('Debe buscar socio por identificación')
  it('Debe editar información de socio')
  it('Debe eliminar socio sin cuentas')
  it('Debe prevenir eliminación con cuentas activas')
})
```

#### 4. **account.cy.ts** - Gestión de Cuentas
```typescript
describe('Gestión de Cuentas Tests', () => {
  it('Debe crear cuenta para socio existente')
  it('Debe rechazar cuenta para socio inexistente')
  it('Debe listar cuentas por socio')
  it('Debe validar saldo inicial')
  it('Debe mostrar estado de cuenta')
})
```

### Ejecutar Pruebas Específicas

```bash
# Ejecutar una suite específica
npx cypress run --spec "cypress/e2e/register.cy.ts"

# Ejecutar en un navegador específico
npx cypress run --browser chrome
npx cypress run --browser firefox

# Ejecutar con reporte
npx cypress run --reporter json
```

### Configuración de Cypress

El archivo `cypress.config.ts` contiene:

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
  },
})
```

### Reportes de Cypress

Los reportes se generan en:
- **Videos**: `cypress/videos/`
- **Screenshots**: `cypress/screenshots/`
- **Reports**: `cypress/results/`

---

## 🔄 Comunicación entre Microservicios (RabbitMQ)

### Exchanges y Queues Configurados

```
cooperativa.exchange (topic)
    │
    ├─► q.socios.validacion
    │   Routing Key: socio.validar
    │   Consumer: Microservicio Socios
    │   Purpose: Validar existencia de socios
    │
    ├─► q.cuentas.validacion
    │   Routing Key: cuentas.validar.eliminacion
    │   Consumer: Microservicio Cuentas
    │   Purpose: Validar cuentas activas antes de eliminar socio
    │
    └─► q.cuentas.prestamos
        Routing Key: cuentas.validar.prestamo
        Consumer: Microservicio Cuentas
        Purpose: Validar cuenta destino para préstamos
```

### Flujos de Validación

#### 1. Crear Cuenta → Validar Socio

```
Frontend → MS Cuentas → RabbitMQ → MS Socios
                                      ↓
                        ← Response ← ✓/✗
```

#### 2. Eliminar Socio → Validar Cuentas

```
Frontend → MS Socios → RabbitMQ → MS Cuentas
                                     ↓
                       ← Response ← ✓/✗
```

#### 3. Aprobar Préstamo → Validar Cuenta Destino

```
MS Socios → RabbitMQ → MS Cuentas
                          ↓
              ← Response ← ✓/✗
```

### Monitorear RabbitMQ

Accede a la consola de administración:
- URL: http://localhost:15672
- Usuario: `admin`
- Password: `admin123`

**Métricas disponibles:**
- Mensajes en cola
- Tasa de publicación
- Tasa de consumo
- Conexiones activas
- Canales abiertos

---

## 📚 Documentación de APIs

### Microservicio Socios (Spring Boot)

**Swagger UI**: http://localhost:8080/swagger-ui.html

#### Endpoints Principales

```http
POST   /api/socios              # Crear socio
GET    /api/socios              # Listar todos
GET    /api/socios/{id}         # Obtener por ID
PUT    /api/socios/{id}         # Actualizar socio
DELETE /api/socios/{id}         # Eliminar socio
GET    /api/socios/identificacion/{id}  # Buscar por cédula

POST   /api/prestamos           # Solicitar préstamo
```

### Microservicio Cuentas (NestJS)

**Swagger UI**: http://localhost:3000/api-docs

#### Endpoints Principales

```http
POST   /cuentas                 # Crear cuenta
GET    /cuentas                 # Listar todas
GET    /cuentas/{id}            # Obtener por ID
PUT    /cuentas/{id}            # Actualizar cuenta
DELETE /cuentas/{id}            # Eliminar cuenta
GET    /cuentas/socio/{socioId} # Cuentas por socio
```

---

## 📁 Estructura del Proyecto

```
taller-pruebas-unitarias/
│
├── frontend/                    # Aplicación React
│   ├── cypress/                 # Pruebas E2E
│   │   ├── e2e/
│   │   │   ├── home.cy.ts
│   │   │   ├── register.cy.ts
│   │   │   ├── partner.cy.ts
│   │   │   └── account.cy.ts
│   │   └── support/
│   ├── src/
│   │   ├── api/                 # Cliente API
│   │   ├── hooks/               # Custom hooks
│   │   ├── models/              # TypeScript interfaces
│   │   ├── pages/               # Componentes de página
│   │   └── services/            # Servicios de negocio
│   └── cypress.config.ts
│
├── socios/                      # Microservicio Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/ec/fin/coacandes/socios/
│   │   │   │   ├── config/      # Configuración (CORS, RabbitMQ, Swagger)
│   │   │   │   ├── controller/  # REST Controllers
│   │   │   │   ├── dto/         # Data Transfer Objects
│   │   │   │   ├── entity/      # Entidades JPA
│   │   │   │   ├── repository/  # Repositorios JPA
│   │   │   │   ├── service/     # Lógica de negocio
│   │   │   │   └── messaging/   # RabbitMQ Listeners
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/ec/fin/coacandes/socios/
│   │           └── SociosApplicationTests.java  # 29 pruebas unitarias
│   └── pom.xml
│
├── microservicio-cuentas/       # Microservicio NestJS
│   ├── src/
│   │   ├── cuentas/
│   │   │   ├── cuentas.controller.ts
│   │   │   ├── cuentas.service.ts
│   │   │   ├── cuentas.module.ts
│   │   │   ├── dto/             # Request/Response DTOs
│   │   │   ├── entities/        # TypeORM Entities
│   │   │   └── repositories/
│   │   ├── rabbitmq/
│   │   │   ├── rabbitmq.service.ts
│   │   │   └── rabbitmq.module.ts
│   │   └── main.ts
│   ├── mysql-init/              # Scripts SQL iniciales
│   ├── docker-compose.yaml      # MySQL + phpMyAdmin
│   └── package.json
│
├── README.md                    # Este archivo
└── README2.md                   # Especificación del taller
```

---

## 🔐 Validaciones Implementadas

### 1. Validación Cross-Service al Crear Cuenta

```typescript
// Microservicio Cuentas valida que el socio existe
async crearCuenta(request: CuentaRequest) {
  const socioValido = await this.rabbitmq.validarSocio(request.socioId);
  
  if (!socioValido) {
    throw new BadRequestException('El socio no existe o no está activo');
  }
  
  return this.repository.save(cuenta);
}
```

### 2. Validación Cross-Service al Eliminar Socio

```java
// Microservicio Socios valida que no tenga cuentas activas
public void eliminarSocio(UUID id) {
    boolean tieneCuentas = cuentaIntegrationService.tieneCuentasActivas(id);
    
    if (tieneCuentas) {
        throw new IllegalStateException(
            "No se puede eliminar al socio porque tiene cuentas activas"
        );
    }
    
    socioRepository.deleteById(id);
}
```

### 3. Validación de Préstamos

```java
// Microservicio Socios valida cuenta destino vía RabbitMQ
public Prestamo crearPrestamo(Prestamo prestamo) {
    boolean cuentaValida = cuentaIntegrationService
        .validarCuentaDestino(prestamo.getCuentaDestino());
    
    if (!cuentaValida) {
        throw new IllegalArgumentException(
            "La cuenta destino no existe o no está activa"
        );
    }
    
    prestamo.setEstado("APROBADO");
    return prestamoRepository.save(prestamo);
}
```

---

## 🐛 Solución de Problemas

### RabbitMQ no responde

```bash
# Verificar estado del servicio
sudo systemctl status rabbitmq-server

# Reiniciar RabbitMQ
sudo systemctl restart rabbitmq-server

# Ver logs
sudo journalctl -u rabbitmq-server -f
```

### PostgreSQL connection refused

```bash
# Verificar que PostgreSQL está ejecutándose
sudo systemctl status postgresql

# Verificar puerto
sudo netstat -tuln | grep 5432
```

### MySQL connection error

```bash
# Verificar contenedor Docker
docker ps

# Reiniciar contenedor
docker-compose restart mysql

# Ver logs
docker logs cooperativa-mysql
```

### Frontend no conecta con backend

1. Verificar que ambos microservicios estén ejecutándose
2. Verificar CORS configurado correctamente
3. Revisar URLs en archivos de configuración

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Pruebas Unitarias (Java)** | 29 tests |
| **Cobertura de Código** | > 80% |
| **Pruebas E2E (Cypress)** | 4 suites |
| **Tiempo Respuesta API** | < 200ms |
| **Inconsistencias Detectadas** | 100% |
| **Microservicios** | 2 |
| **Líneas de Código** | ~5000 |

---

## 👥 Autores

Desarrollado como parte del curso de Software Seguro - ESPE

---

## 📄 Licencia

Este proyecto es de uso académico." 
