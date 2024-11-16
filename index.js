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

// Inicializar Express
const app = express();
app.set('PORT', process.env.PORT || 4000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Documentación Swagger
swaggerDocs(app);

// Rutas REST (autenticación)
app.use('/api', require('./routes/index'));

// Middleware para autenticar token JWT
const authenticateToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return null;
  }
};

// Configuración de Apollo Server
async function startServer() {
  try {
    await connectDB();

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const user = authenticateToken(authHeader);
        return { user }; // Pasa el usuario autenticado al contexto
      },
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(app.get('PORT'), () => {
      console.log(
        `🚀 Server is running! \nREST API: http://localhost:${app.get('PORT')}/api \nGraphQL: http://localhost:${app.get('PORT')}${apolloServer.graphqlPath}`
      );
    });
  } catch (err) {
    console.error('Error starting server:', err.stack || err.message);
  }
}

startServer();
