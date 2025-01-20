import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Trainer } from "@/shared/models";
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatCourses } from "@/formatter/courses";
import { ITrainer } from "@/shared/types/trainer.type";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        errorHandler(res, "Method Not Allowed", 405);
    }

    try {
        const trainers = await Trainer.findAll() as unknown as ITrainer[];;

        res.status(200).json(trainers);
    } catch (error) {
        console.error(error);
        errorHandler(res, "Expected error", 500);
    }
}