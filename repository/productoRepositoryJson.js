const fs = require('fs').promises;
const path = require('path');
const Producto = require('../models/producto');

class ProductoRepositoryJson {
  constructor() {
    this.dbPath = path.join(__dirname, '../database/database.json');
    this.data = { productos: [] };
  }

  /**
   * Inicializa el archivo de base de datos
   */
  async initialize() {
    try {
      const data = await fs.readFile(this.dbPath, 'utf8');
      this.data = JSON.parse(data);
      console.log('Base de datos JSON cargada');
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Crear el archivo si no existe
        await this.save();
        console.log('Base de datos JSON creada');
      } else {
        console.error('Error al cargar base de datos JSON:', error.message);
        throw error;
      }
    }
  }

  /**
   * Guarda los datos en el archivo
   */
  async save() {
    try {
      const dir = path.dirname(this.dbPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al guardar base de datos JSON:', error.message);
      throw error;
    }
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

    // Generar ID único
    const id = this.generateId();
    producto.id = id;

    this.data.productos.push(producto.toJSON());
    await this.save();

    return producto;
  }

  /**
   * Obtiene todos los productos
   * @returns {Producto[]}
   */
  async findAll() {
    return this.data.productos.map(p => Producto.fromJSON(p));
  }

  /**
   * Obtiene un producto por ID
   * @param {string} id
   * @returns {Producto|null}
   */
  async findById(id) {
    const producto = this.data.productos.find(p => p.id === id);
    if (!producto) return null;
    return Producto.fromJSON(producto);
  }

  /**
   * Actualiza un producto por ID
   * @param {string} id
   * @param {Object} updates
   * @returns {Producto|null}
   */
  async update(id, updates) {
    const index = this.data.productos.findIndex(p => p.id === id);
    if (index === -1) return null;

    const producto = this.data.productos[index];

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

    await this.save();
    return Producto.fromJSON(producto);
  }

  /**
   * Incrementa el stock de un producto
   * @param {string} id
   * @param {number} increment
   * @returns {Producto|null}
   */
  async incrementStock(id, increment) {
    const index = this.data.productos.findIndex(p => p.id === id);
    if (index === -1) return null;

    const producto = this.data.productos[index];

    // Validar incremento
    if (typeof increment !== 'number' || increment < 1 || !Number.isInteger(increment)) {
      const error = new Error('El incremento debe ser un entero mayor o igual a 1');
      error.statusCode = 400;
      throw error;
    }

    producto.stockAmount += increment;
    await this.save();
    return Producto.fromJSON(producto);
  }

  /**
   * Elimina un producto por ID
   * @param {string} id
   * @returns {boolean}
   */
  async delete(id) {
    const index = this.data.productos.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.data.productos.splice(index, 1);
    await this.save();
    return true;
  }

  /**
   * Genera un ID único
   * @returns {string}
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = ProductoRepositoryJson;
