import { ICourse } from "@/shared/types/course.type";
import { ITrainer } from "@/shared/types/trainer.type";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkIfAnotherCourseHaveSameDateAndLocation = (courseList: ICourse[], course: any): ICourse | undefined => {
    return courseList.find((c) => {
        return c.date === course.date && c.location === course.location;
    });
}

export const suggestQualifiedTrainer = (trainers: ITrainer[], course: any): ITrainer[] => {
    return trainers.sort((a, b) => {
        const aIsQualified = a.location === course.location && a.trainingSubjects.includes(course.subject);
        const bIsQualified = b.location === course.location && b.trainingSubjects.includes(course.subject);

        if (aIsQualified && !bIsQualified) return -1;
        if (!aIsQualified && bIsQualified) return 1;
        return 0;
    });
}