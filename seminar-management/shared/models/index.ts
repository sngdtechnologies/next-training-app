import Course from './Course';
import Trainer from './Trainer';

Trainer.hasMany(Course, { foreignKey: 'trainerId', onDelete: 'CASCADE' });
Course.belongsTo(Trainer, { foreignKey: 'trainerId' });

export { Course, Trainer };