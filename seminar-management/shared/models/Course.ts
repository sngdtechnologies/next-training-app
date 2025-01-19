import { DataTypes } from 'sequelize';
import { sequelize } from '../lib/config/db';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  participants: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
  trainer_price: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } }
});

console.log(Course === sequelize.models.Course);

export default Course;