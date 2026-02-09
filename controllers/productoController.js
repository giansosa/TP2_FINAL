const Producto = require('../models/producto');

class ProductoController {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  /**
   * Crea un nuevo producto
   * @param {Request} req
   * @param {Response} res
   */
  async create(req, res) {
    try {
      const { producto, stockAmount, fechaIngreso } = req.body;

      const newProducto = new Producto({
        producto,
        stockAmount,
        fechaIngreso,
      });

      const saved = await this.productoRepository.create(newProducto);

      return res.status(201).json(saved.toJSON());
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        statusCode,
        error: error.message || 'Error al crear el producto',
      });
    }
  }

  /**
   * Obtiene todos los productos
   * @param {Request} req
   * @param {Response} res
   */
  async findAll(req, res) {
    try {
      const productos = await this.productoRepository.findAll();
      return res.status(200).json(productos.map(p => p.toJSON()));
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        error: error.message || 'Error al obtener los productos',
      });
    }
  }

  /**
   * Obtiene un producto por ID
   * @param {Request} req
   * @param {Response} res
   */
  async findById(req, res) {
    try {
      const { id } = req.params;
      const producto = await this.productoRepository.findById(id);

      if (!producto) {
        return res.status(404).json({
          statusCode: 404,
          error: 'Producto no encontrado',
        });
      }

      return res.status(200).json(producto.toJSON());
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        error: error.message || 'Error al obtener el producto',
      });
    }
  }

  /**
   * Actualiza un producto por ID
   * @param {Request} req
   * @param {Response} res
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const producto = await this.productoRepository.update(id, updates);

      if (!producto) {
        return res.status(404).json({
          statusCode: 404,
          error: 'Producto no encontrado',
        });
      }

      return res.status(200).json(producto.toJSON());
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        statusCode,
        error: error.message || 'Error al actualizar el producto',
      });
    }
  }

  /**
   * Incrementa el stock de un producto
   * @param {Request} req
   * @param {Response} res
   */
  async incrementStock(req, res) {
    try {
      const { id } = req.params;
      const { increment } = req.body;

      if (increment === undefined || increment === null) {
        return res.status(400).json({
          statusCode: 400,
          error: 'El campo "increment" es requerido',
        });
      }

      const producto = await this.productoRepository.incrementStock(id, increment);

      if (!producto) {
        return res.status(404).json({
          statusCode: 404,
          error: 'Producto no encontrado',
        });
      }

      return res.status(200).json(producto.toJSON());
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        statusCode,
        error: error.message || 'Error al incrementar el stock',
      });
    }
  }

  /**
   * Elimina un producto por ID
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.productoRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({
          statusCode: 404,
          error: 'Producto no encontrado',
        });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        error: error.message || 'Error al eliminar el producto',
      });
    }
  }
}

module.exports = ProductoController;
