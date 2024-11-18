# **API de Productos y Categorías con GraphQL y JWT**

## **Descripción**
Esta API combina funcionalidades de REST y GraphQL para gestionar productos y categorías. La autenticación se realiza mediante **JWT (JSON Web Token)** para proteger los endpoints de GraphQL.

---

## **Características Principales**
1. **Autenticación REST**:
   - Endpoints `/users` y `/login` para registro e inicio de sesión.
2. **Gestión de Productos y Categorías con GraphQL**:
   - Consultas y mutaciones para trabajar con productos y categorías.
3. **Protección con JWT**:
   - Se requiere un token JWT para acceder a los datos mediante GraphQL.
4. **Documentación Swagger**:
   - Endpoints REST documentados en `/api-docs`.
5. **Documentación Apollo**:
   - Explora el esquema y prueba las consultas en el endpoint `/graphql`.

---

## **Tecnologías Usadas**
- **Node.js**
- **Express**
- **Apollo Server**
- **GraphQL**
- **MongoDB** (base de datos)
- **JSON Web Tokens (JWT)**
- **Swagger** (documentación REST)

---

## **Requisitos Previos**
1. Tener instalado:
   - **Node.js** (v16 o superior)
   - **MongoDB**
2. Crear un archivo `.env` con las siguientes variables:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/tuBaseDeDatos
   JWT_SECRET=clave_secreta_para_jwt
   ```

---

## **Instalación**
1. Clonar este repositorio:
   ```bash
   git clone https://github.com/tu-repositorio.git
   cd tu-repositorio
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor:
   ```bash
   npm start
   ```

---

## **Endpoints REST**
### **1. Registrar Usuario**
- **URL**: `/api/users`
- **Método**: `POST`
- **Cuerpo**:
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "password": "clave1234"
  }
  ```
- **Respuesta**:
  ```json
  {
    "message": "Usuario creado exitosamente"
  }
  ```

### **2. Login**
- **URL**: `/api/login`
- **Método**: `POST`
- **Cuerpo**:
  ```json
  {
    "email": "juan.perez@example.com",
    "password": "clave1234"
  }
  ```
- **Respuesta**:
  ```json
  {
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

## **Usando GraphQL**
### **Autenticación**
Agrega el token JWT en el encabezado de las solicitudes GraphQL:

```json
{
  "Authorization": "Bearer <tu-token-jwt>"
}
```

### **Consultas y Mutaciones**
#### **1. Obtener Productos**
```graphql
query {
  getProducts {
    id
    name
    description
    value
    category {
      name
    }
  }
}
```

#### **2. Crear Producto**
```graphql
mutation {
  addProduct(
    name: "Laptop",
    description: "Una laptop potente",
    value: 1500.99,
    category: "id-de-la-categoria"
  ) {
    id
    name
  }
}
```

#### **3. Obtener Categorías**
```graphql
query {
  getCategories {
    id
    name
    products {
      name
    }
  }
}
```

---

## **Documentación Swagger**
La documentación de los endpoints REST está disponible en [http://localhost:4000/api-docs](http://localhost:4000/api-docs).

---

## **Documentación Apollo**
La documentación de los esquemas y resoluciones de GraphQL está disponible a través de **Apollo Sandbox**. Puedes acceder a ella en el siguiente enlace:

- [http://localhost:4000/graphql](http://localhost:4000/graphql)

### **Instrucciones para Consultas**
1. Abre el enlace anterior en tu navegador.
2. Usa el explorador de esquemas para navegar por las consultas y mutaciones disponibles.
3. Agrega un token JWT en los **Headers** para acceder a los recursos protegidos:
   ```json
   {
     "Authorization": "Bearer <tu-token-jwt>"
   }
   ```
4. Escribe tus consultas o mutaciones y ejecútalas para probar la API.

---

## **Estructura del Proyecto**
```plaintext
.
├── controllers/         # Controladores para las rutas REST
├── drivers/             # Conexión a la base de datos
├── graphql/             # TypeDefs y Resolvers para GraphQL
├── middleware/          # Middleware para JWT
├── models/              # Modelos de MongoDB
├── routes/              # Rutas para la API REST
├── .env                 # Variables de entorno
├── index.js             # Punto de entrada del servidor
└── swagger.js           # Configuración de Swagger
```

---

## **Errores Comunes**
1. **Token no proporcionado**:
   - Asegúrate de enviar el encabezado `Authorization` con el token.
2. **Token inválido o expirado**:
   - Vuelve a iniciar sesión para obtener un nuevo token.
3. **Problemas de conexión con MongoDB**:
   - Verifica que tu base de datos esté corriendo y que `MONGO_URI` esté configurado correctamente.


## **Licencia**
Este proyecto está bajo la Licencia MIT.

---

Con este **README**, tu proyecto está bien documentado y será fácil de entender y usar por cualquier colaborador o evaluador. 🚀
