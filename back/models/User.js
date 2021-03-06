const { DataTypes } = require('sequelize');
const db            = require('../config/database');
const Like = require('./Like');

const User = db.define('user', {
  
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  bio: { type: DataTypes.STRING, defaultValue: "à propos de moi..." },
  isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
},
{
  timestamps: false,
  modelName: 'User',
  engine: 'INNODB'
});

module.exports = User;