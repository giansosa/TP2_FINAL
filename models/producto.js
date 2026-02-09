/**
 * Modelo de Producto
 * Esquema/DTO para la entidad Producto
 */

class Producto {
  constructor(data) {
    this.id = data.id || null;
    this.producto = data.producto || '';
    this.stockAmount = data.stockAmount || 0;
    this.fechaIngreso = data.fechaIngreso || new Date().toISOString().split('T')[0];
  }

  /**
   * Valida los datos del producto
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Validar producto
    if (!this.producto || typeof this.producto !== 'string' || this.producto.trim() === '') {
      errors.push('El campo "producto" es requerido y no puede estar vacío');
    }

    // Validar stockAmount
    if (typeof this.stockAmount !== 'number' || this.stockAmount < 0 || !Number.isInteger(this.stockAmount)) {
      errors.push('El campo "stockAmount" debe ser un entero mayor o igual a 0');
    }

    // Validar fechaIngreso (opcional, pero si está presente debe ser válida)
    if (this.fechaIngreso && !this.isValidDate(this.fechaIngreso)) {
      errors.push('El campo "fechaIngreso" debe ser una fecha válida en formato YYYY-MM-DD');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Valida si una fecha está en formato YYYY-MM-DD
   * @param {string} dateString
   * @returns {boolean}
   */
  isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Convierte el producto a formato plano (para JSON)
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      producto: this.producto,
      stockAmount: this.stockAmount,
      fechaIngreso: this.fechaIngreso,
    };
  }

  /**
   * Crea un producto desde un objeto plano
   * @param {Object} data
   * @returns {Producto}
   */
  static fromJSON(data) {
    return new Producto(data);
  }
}

module.exports = Producto;
