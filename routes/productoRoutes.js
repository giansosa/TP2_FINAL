const express = require('express');
const router = express.Router();

/**
 * Crea las rutas de productos
 * @param {ProductoController} productoController
 * @returns {Router}
 */
function createProductoRoutes(productoController) {
  // POST /api/v1/productos - Crear producto (sin auth por ahora)
  router.post('/', (req, res) => productoController.create(req, res));

  // GET /api/v1/productos - Listar productos (sin auth)
  router.get('/', (req, res) => productoController.findAll(req, res));

  // GET /api/v1/productos/:id - Obtener producto por ID (sin auth)
  router.get('/:id', (req, res) => productoController.findById(req, res));

  // PUT /api/v1/productos/:id - Editar producto (sin auth por ahora, se protegerá en Fase 2)
  router.put('/:id', (req, res) => productoController.update(req, res));

  // DELETE /api/v1/productos/:id - Eliminar producto (sin auth por ahora, se protegerá en Fase 2)
  router.delete('/:id', (req, res) => productoController.delete(req, res));

  return router;
}

module.exports = createProductoRoutes;
