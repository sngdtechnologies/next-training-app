import { ICourse } from "@/shared/types/course.type";
import { ITrainer } from "@/shared/types/trainer.type";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkIfAnotherCourseHaveSameDateAndLocation = (courseList: ICourse[], course: any): ICourse | undefined => {
    return courseList.find((c) => {
        return c.date === course.date && c.location === course.location;
    });
}