import { DataTypes } from 'sequelize';
import { sequelize } from '../lib/config/db';

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
});

console.log(User === sequelize.models.User);

export default User;