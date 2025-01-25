import { sendAssignmentEmail } from "@/shared/lib/config/email";
import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Course, Trainer } from "@/shared/models";
import { ITrainer } from "@/shared/types/trainer.type";
import { VAsignTrainer } from "@/validation/trainer";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "PUT":
            try {
                const data: { courseId: number, trainerId: number } = await req.body;
                
                await VAsignTrainer.validate(data, { abortEarly: false });

                const course = await Course.findOne({ where: { id: data.courseId } });
                if (!course) {
                    return errorHandler(res, "Course not found", 404);
                }

                const trainer = await Trainer.findOne({ where: { id: data.trainerId } }) as unknown as ITrainer;
                if (!trainer) {
                    return errorHandler(res, "Trainer not found", 404);
                }

                await Course.update(
                    { trainerId: data.trainerId },
                    { where: { id: data.courseId } }
                );

                sendAssignmentEmail(trainer.email, course);
                
                res.status(201).json({ message: "Trainer assigned successfully." });
            } catch (error) {
                console.error(error);
                if (error instanceof Error && error.name === 'ValidationError') {
                    return res.status(400).json({ errors: (error as any).errors });
                }
                errorHandler(res, "Expected error", 500);
            }
            break;
    
        default:
            errorHandler(res, "Method Not Allowed", 405);
            break;
    }
}