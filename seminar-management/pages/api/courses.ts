import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Course } from "@/shared/models";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ICourse } from "@/shared/types/course.type";
import { formatCourses } from "@/formatter/courses";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        errorHandler(res, "Method Not Allowed", 405);
    }

    try {
        const courses = await Course.findAll({ include: 'Trainer' }) as unknown as ICourse[];;

        res.status(200).json(formatCourses(courses));
    } catch (error) {
        console.error(error);
        errorHandler(res, "Expected error", 500);
    }
}