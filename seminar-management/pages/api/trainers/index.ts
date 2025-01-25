import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Trainer } from "@/shared/models";
import type { NextApiRequest, NextApiResponse } from 'next';
import { ITrainer } from "@/shared/types/trainer.type";
import { formatTrainer } from "@/formatter/trainers";
import { VTrainer } from "@/validation/trainer";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "GET":
            try {
                const trainers = await Trainer.findAll() as unknown as ITrainer[];;

                res.status(200).json(trainers);
            } catch (error) {
                console.error(error);
                errorHandler(res, "Expected error", 500);
            }
            break;
        
        case "POST":
            try {
                const data: ITrainer = await req.body;
                
                await VTrainer.validate(data, { abortEarly: false });

                const trainer = await Trainer.create({ ...data });
                
                res.status(201).json(formatTrainer(trainer));
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