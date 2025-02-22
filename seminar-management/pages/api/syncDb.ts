import { sequelize } from "@/shared/lib/config/db";
import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Course, Trainer } from "@/shared/models";
import User from "@/shared/models/User";
import { ITrainer } from "@/shared/types/trainer.type";
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return errorHandler(res, "Method Not Allowed", 405);
    }

    (async () => {
        const sequelize = new Sequelize(`mysql://${process.env.MYSQL_USER || ''}:${process.env.MYSQL_PASSWORD}@localhost:3306`, {
            logging: false,
        });

        try {
            const dbName = 'training';

            await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
            console.log(`Database "${dbName}" created successfully!`);
        } catch (error) {
            console.error('Error creating database:', error);
        } finally {
            await sequelize.close();
        }
    })();

    try {
        await sequelize.sync({ force: true });

        const trainer = await Trainer.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            location: 'Berlin',
            trainingSubjects: ["React.js"],
            price: 500
        }) as unknown as ITrainer;

        await Course.create({
            name: 'Advanced React.js',
            date: "2024-10-15",
            subject: 'React.js',
            location: "Stuttgart",
            participants: 15,
            notes: "Introduction to React.js",
            price: 250,
            trainerId: trainer.id,
        });

        const trainer2 = await Trainer.create({
            name: "John Smith",
            trainingSubjects: ["Node.js", "React.js"],
            location: "Stuttgart",
            email: "john.smith@example.com",
            price: 500
        }) as unknown as ITrainer;

        await Course.create({
            name: "React.js Fundamentals",
            date: "2024-10-15",
            subject: "Node.js",
            location: "Stuttgart",
            participants: 15,
            notes: "Introduction to React.js",
            price: 250,
            trainerId: trainer2.id,
        });

        await Course.create({
            name: "React.js Fundamentals",
            date: "2024-10-15",
            subject: "React.js",
            location: "Stuttgart",
            participants: 15,
            notes: "Introduction to React.js",
            price: 250,
            trainerId: null,
        });

        const hashedPassword = await bcrypt.hash("john123", Number(process.env.SALT_ROUNDS));
        await User.create({
            name: 'John Doe',
            email: 'john@gmail.com',
            username: 'john.doe',
            password: hashedPassword
        });

        return res.status(200).json({ message: "Database synced successfully!", trainer, subjects: trainer.trainingSubjects[0], type: typeof trainer.trainingSubjects });
    } catch (error) {
        console.error(error);
        return errorHandler(res, "Database sync failed", 500);
    }
}