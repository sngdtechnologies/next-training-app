import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Course, Trainer } from "@/shared/models";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "PUT":
            try {
                const data: { courseId: number, trainerId: number } = await req.body;
                
                const course = await Course.findOne({ where: { id: data.courseId } });
                if (!course) {
                    return errorHandler(res, "Course not found", 404);
                }

                const trainer = await Trainer.findOne({ where: { id: data.trainerId } });
                if (!trainer) {
                    return errorHandler(res, "Trainer not found", 404);
                }

                await Course.update(
                    { trainerId: data.trainerId },
                    { where: { id: data.courseId } }
                );
                
                res.status(201).json({ message: "Trainer assigned successfully." });
            } catch (error) {
                console.error(error);
                errorHandler(res, "Expected error", 500);
            }
            break;
    
        default:
            errorHandler(res, "Method Not Allowed", 405);
            break;
    }
}