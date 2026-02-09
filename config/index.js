require('dotenv').config();

const config = {
  // Persistencia
  dbProvider: process.env.DB_PROVIDER || 'mongo',
  mongoUri: process.env.MONGO_URI,

  // Autenticación
  authMethod: process.env.AUTH_METHOD || 'api-key',
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Servidor
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;
