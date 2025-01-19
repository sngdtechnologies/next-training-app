import { Course, Trainer } from "@/shared/models";
import { sequelize } from "../config/db";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    await Trainer.create({
      name: 'John Doe',
      training_subjects: ['React.js', 'Next.js'],
      location: 'Berlin',
      email: 'john.doe@example.com',
    });

    await Course.create({
      name: 'Advanced React.js',
      date: '2024-09-15',
      subject: 'React.js',
      location: 'Stuttgart',
      participants: 20,
      notes: 'Focus on hooks and context API',
      price: 2000,
      trainer_price: 500
    });

    console.log('Sample data created');
  } catch (error) {
    console.error('Unable to sync database:', error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();