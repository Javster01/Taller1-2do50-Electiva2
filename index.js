require('dotenv').config();
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./drivers/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const swaggerDocs = require('./swagger');

// Verificar que las variables de entorno necesarias están configuradas
if (!process.env.JWT_SECRET) {
  console.error('❌ Error: JWT_SECRET no está definido en las variables de entorno.');
  process.exit(1);
}

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 4000;

app.set('PORT', PORT);

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir cualquier origen en desarrollo
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS bloqueado para el origen: ${origin}`));
      }
    },
    credentials: true, // Permitir cookies y encabezados de autenticación
  })
);

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Documentación Swagger
swaggerDocs(app);

// Rutas REST (autenticación)
app.use('/api', require('./routes/index'));

// Middleware para autenticar token JWT
const authenticateToken = (authHeader) => {
  if (!authHeader) {
    console.warn('⚠️ Falta el encabezado de autorización.');
    return null;
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
    console.warn('⚠️ Formato del token inválido. Use "Bearer <token>".');
    return null;
  }

  const token = tokenParts[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verifica y decodifica el token
  } catch (err) {
    console.error('❌ Fallo en la verificación del JWT:', err.message);
    return null;
  }
};

// Configuración de Apollo Server
async function startServer() {
  try {
    // Conexión a la base de datos
    await connectDB();
    console.log('✅ Conexión a la base de datos establecida.');

    // Configuración de Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const user = authenticateToken(authHeader); // Valida el token y obtiene el usuario
        return { user }; // Agrega el usuario al contexto
      },
      introspection: true, // Habilita introspección para GraphQL Playground
      formatError: (err) => {
        console.error('❌ Error en GraphQL:', err.message);
        return {
          message: err.message,
          locations: err.locations,
          path: err.path,
        };
      },
    });

    // Inicializar Apollo Server
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 REST API: http://localhost:${PORT}/api`);
      console.log(`🔗 GraphQL Playground: http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err.stack || err.message);
    process.exit(1); // Finalizar el proceso en caso de error crítico
  }
}

// Iniciar el servidor
startServer();
