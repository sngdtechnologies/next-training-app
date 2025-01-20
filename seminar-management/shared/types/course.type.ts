import dayjs from "dayjs";
import { ITrainer } from "./trainer.type";

export interface ICourse {
    id?: number,
    name: string,
    date: dayjs.Dayjs | null,
    subject: string,
    location: string,
    notes: string,
    participants: number,
    price: number,
    trainer?: ITrainer | null
}