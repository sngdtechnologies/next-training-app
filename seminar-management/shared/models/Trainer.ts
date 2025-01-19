import { DataTypes } from 'sequelize';
import { sequelize } from '../lib/config/db';

const Trainer = sequelize.define('Trainer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  training_subjects: { type: DataTypes.JSON, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
});

console.log(Trainer === sequelize.models.Trainer);

export default Trainer;