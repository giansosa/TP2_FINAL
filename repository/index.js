const ProductoRepositoryMongo = require('./productoRepositoryMongo');
const ProductoRepositoryJson = require('./productoRepositoryJson');
const config = require('../config');

/**
 * Factory para crear repositorios según la configuración
 */
class RepositoryFactory {
  static createProductoRepository() {
    if (config.dbProvider === 'mongo') {
      return new ProductoRepositoryMongo();
    } else if (config.dbProvider === 'json') {
      return new ProductoRepositoryJson();
    } else {
      throw new Error(`DB_PROVIDER no válido: ${config.dbProvider}. Debe ser 'mongo' o 'json'`);
    }
  }
}

module.exports = RepositoryFactory;
