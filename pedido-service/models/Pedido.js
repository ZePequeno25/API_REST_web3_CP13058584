import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  produtoIds: {  // Novo campo: array de IDs de produtos
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  }
}, {
  timestamps: true
});

export default Pedido;