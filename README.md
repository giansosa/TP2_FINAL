# API RESTful - Gestión de Productos (Stock)

Examen Final - Taller de Programación 2

## Descripción

API RESTful en Node.js con Express para gestionar productos y su stock. Implementa persistencia dual (MongoDB Atlas o archivo JSON local) y autenticación flexible (x-api-key o JWT).

## Características

- CRUD completo de productos
- Persistencia configurable (MongoDB/JSON)
- Validaciones de negocio
- Manejo estandarizado de errores
- Autenticación flexible (x-api-key y JWT) - *Fase 2*
- Integración con API externa para generación de CSV - *Fase 3*

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/giansosa/TP2_FINAL.git
cd TP2_FINAL
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` según necesidad:
```env
# Persistencia
DB_PROVIDER=mongo  # Opciones: mongo | json
MONGO_URI=mongodb+srv://...

# Autenticación
AUTH_METHOD=api-key  # Opciones: api-key | jwt | both
API_KEY=tu-api-key-secreta
JWT_SECRET=tu-jwt-secret
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development
```

## Uso

### Modo MongoDB

```bash
# Asegurarse de que DB_PROVIDER=mongo en .env
npm start
```

### Modo JSON

```bash
# Asegurarse de que DB_PROVIDER=json en .env
npm start
```

### Modo Desarrollo

```bash
npm run dev
```

## Endpoints

### Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/productos` | Crear producto | No |
| GET | `/api/v1/productos` | Listar productos | No |
| GET | `/api/v1/productos/:id` | Obtener producto | No |
| PUT | `/api/v1/productos/:id` | Editar producto | Sí* |
| DELETE | `/api/v1/productos/:id` | Eliminar | Sí* |

*Requiere autenticación (se implementará en Fase 2)

### Modelo de Producto

```json
{
  "id": "string (UUID o ObjectId)",
  "producto": "string (requerido, no vacío)",
  "stockAmount": "integer ≥ 0 (requerido)",
  "fechaIngreso": "date (YYYY-MM-DD, opcional)"
}
```

### Ejemplos de Uso

#### Crear producto
```bash
curl -X POST http://localhost:3000/api/v1/productos \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "Laptop HP",
    "stockAmount": 10
  }'
```

#### Listar productos
```bash
curl http://localhost:3000/api/v1/productos
```

#### Obtener producto por ID
```bash
curl http://localhost:3000/api/v1/productos/:id
```

#### Actualizar producto
```bash
curl -X PUT http://localhost:3000/api/v1/productos/:id \
  -H "Content-Type: application/json" \
  -d '{
    "stockAmount": 20
  }'
```

#### Eliminar producto
```bash
curl -X DELETE http://localhost:3000/api/v1/productos/:id
```

## Tests

Se incluye un archivo de tests en formato REST Client para VSCode:

`tests/test.endpoints.http`

Para ejecutar los tests:
1. Instalar la extensión "REST Client" en VSCode
2. Abrir el archivo `tests/test.endpoints.http`
3. Hacer clic en "Send Request" sobre cada endpoint

## Estructura del Proyecto

```
proyecto-stock-api/
├── app.js                          # Configuración de Express
├── index.js                        # Punto de entrada
├── package.json                    # Dependencias
├── .env                            # Variables de entorno
├── .env.example                    # Plantilla de variables
├── .gitignore                      # Archivos ignorados
├── README.md                       # Documentación
│
├── config/
│   └── index.js                    # Carga de configuración
│
├── controllers/
│   └── productoController.js       # Lógica de control
│
├── models/
│   └── producto.js                 # Esquema/DTO
│
├── repository/
│   ├── productoRepositoryMongo.js  # Implementación MongoDB
│   ├── productoRepositoryJson.js   # Implementación JSON
│   └── index.js                    # Factory
│
├── routes/
│   └── productoRoutes.js           # Rutas de productos
│
├── database/
│   └── database.json               # Persistencia JSON (opcional)
│
└── tests/
    └── test.endpoints.http         # Tests REST Client
```

## Validaciones

### Al crear producto
- `producto`: requerido, no vacío
- `stockAmount`: entero ≥ 0
- `fechaIngreso`: opcional, formato YYYY-MM-DD

### Al actualizar producto
- `producto`: no puede estar vacío si se actualiza
- `stockAmount`: entero ≥ 0 si se actualiza

## Respuestas de Error

Formato estandarizado:

```json
{
  "statusCode": 400,
  "error": "Mensaje descriptivo"
}
```

Códigos de error comunes:
- `400`: Bad Request (validación fallida)
- `404`: Not Found (recurso no encontrado)
- `500`: Internal Server Error

## Health Check

```bash
curl http://localhost:3000/health
```

Respuesta:
```json
{
  "status": "ok",
  "dbProvider": "mongo",
  "timestamp": "2024-02-09T22:00:00.000Z"
}
```

## Autor

Gian Sosa

## Licencia

ISC
