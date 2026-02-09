const mongoose = require('mongoose');
const Producto = require('../models/producto');

// Definir el esquema de Mongoose para Producto
const productoSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: true,
    trim: true,
  },
  stockAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  fechaIngreso: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
}, {
  timestamps: true,
});

// Crear el modelo de Mongoose
const ProductoModel = mongoose.model('Producto', productoSchema);

class ProductoRepositoryMongo {
  constructor() {
    this.model = ProductoModel;
  }

  /**
   * Conecta a MongoDB
   * @param {string} uri
   */
  async connect(uri) {
    try {
      await mongoose.connect(uri);
      console.log('Conectado a MongoDB Atlas');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error.message);
      throw error;
    }
  }

  /**
   * Desconecta de MongoDB
   */
  async disconnect() {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }

  /**
   * Crea un nuevo producto
   * @param {Producto} producto
   * @returns {Producto}
   */
  async create(producto) {
    const validation = producto.validate();
    if (!validation.valid) {
      const error = new Error(validation.errors.join(', '));
      error.statusCode = 400;
      throw error;
    }

    const newProducto = new this.model({
      producto: producto.producto,
      stockAmount: producto.stockAmount,
      fechaIngreso: producto.fechaIngreso,
    });

    const saved = await newProducto.save();

    return Producto.fromJSON({
      id: saved._id.toString(),
      producto: saved.producto,
      stockAmount: saved.stockAmount,
      fechaIngreso: saved.fechaIngreso,
    });
  }

  /**
   * Obtiene todos los productos
   * @returns {Producto[]}
   */
  async findAll() {
    const productos = await this.model.find().sort({ createdAt: -1 });
    return productos.map(p => Producto.fromJSON({
      id: p._id.toString(),
      producto: p.producto,
      stockAmount: p.stockAmount,
      fechaIngreso: p.fechaIngreso,
    }));
  }

  /**
   * Obtiene un producto por ID
   * @param {string} id
   * @returns {Producto|null}
   */
  async findById(id) {
    try {
      const producto = await this.model.findById(id);
      if (!producto) return null;

      return Producto.fromJSON({
        id: producto._id.toString(),
        producto: producto.producto,
        stockAmount: producto.stockAmount,
        fechaIngreso: producto.fechaIngreso,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Actualiza un producto por ID
   * @param {string} id
   * @param {Object} updates
   * @returns {Producto|null}
   */
  async update(id, updates) {
    try {
      const producto = await this.model.findById(id);
      if (!producto) return null;

      // Validar actualizaciones
      if (updates.producto !== undefined) {
        if (!updates.producto || typeof updates.producto !== 'string' || updates.producto.trim() === '') {
          const error = new Error('El campo "producto" no puede estar vacío');
          error.statusCode = 400;
          throw error;
        }
        producto.producto = updates.producto;
      }

      if (updates.stockAmount !== undefined) {
        if (typeof updates.stockAmount !== 'number' || updates.stockAmount < 0 || !Number.isInteger(updates.stockAmount)) {
          const error = new Error('El campo "stockAmount" debe ser un entero mayor o igual a 0');
          error.statusCode = 400;
          throw error;
        }
        producto.stockAmount = updates.stockAmount;
      }

      if (updates.fechaIngreso !== undefined) {
        producto.fechaIngreso = updates.fechaIngreso;
      }

      const updated = await producto.save();

      return Producto.fromJSON({
        id: updated._id.toString(),
        producto: updated.producto,
        stockAmount: updated.stockAmount,
        fechaIngreso: updated.fechaIngreso,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Incrementa el stock de un producto
   * @param {string} id
   * @param {number} increment
   * @returns {Producto|null}
   */
  async incrementStock(id, increment) {
    try {
      const producto = await this.model.findById(id);
      if (!producto) return null;

      // Validar incremento
      if (typeof increment !== 'number' || increment < 1 || !Number.isInteger(increment)) {
        const error = new Error('El incremento debe ser un entero mayor o igual a 1');
        error.statusCode = 400;
        throw error;
      }

      producto.stockAmount += increment;
      const updated = await producto.save();

      return Producto.fromJSON({
        id: updated._id.toString(),
        producto: updated.producto,
        stockAmount: updated.stockAmount,
        fechaIngreso: updated.fechaIngreso,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Elimina un producto por ID
   * @param {string} id
   * @returns {boolean}
   */
  async delete(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      if (error.name === 'CastError') {
        return false;
      }
      throw error;
    }
  }
}

module.exports = ProductoRepositoryMongo;
