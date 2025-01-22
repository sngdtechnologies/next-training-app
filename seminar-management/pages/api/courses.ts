import { errorHandler } from "@/shared/lib/utils/errorHandler";
import { Course } from "@/shared/models";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ICourse } from "@/shared/types/course.type";
import { formatCourse, formatCourses } from "@/formatter/courses";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case "GET":
            try {
                const courses = await Course.findAll({ include: 'Trainer' }) as unknown as ICourse[];
        
                res.status(200).json(formatCourses(courses));
            } catch (error) {
                console.error(error);
                errorHandler(res, "Expected error", 500);
            }
            break;
        
        case "POST":
            try {
                const data: ICourse = await req.body;
                console.log("data", data);
                const course = await Course.create({ ...data, trainerId: data.trainer?.id });
                
                res.status(201).json(formatCourse(course));
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