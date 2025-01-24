import { ICourse } from "@/shared/types/course.type";
import { ITrainer } from "@/shared/types/trainer.type";
import { formatDateToBackend } from "./date";
import dayjs from "dayjs";

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkIfAnotherCourseHaveSameDateAndLocation = (courseList: ICourse[], course: any): ICourse | undefined => {
    return courseList.find((c) => {
        return formatDateToBackend(c.date) === formatDateToBackend(course.date) && c.location === course.location;
    });
}

// This function places trainers matching the criteria of availability and expertise
export const suggestQualifiedTrainer = (trainers: ITrainer[], course: any): ITrainer[] => {
    return trainers.sort((a, b) => {
        const aIsQualified = a.location === course.location && a.trainingSubjects.includes(course.subject);
        const bIsQualified = b.location === course.location && b.trainingSubjects.includes(course.subject);

        if (aIsQualified && !bIsQualified) return -1;
        if (!aIsQualified && bIsQualified) return 1;
        return 0;
    });
}

export const checkIfTrainerIsAvalaible = (courses: ICourse[], trainerId: number | undefined, date: dayjs.Dayjs | null): boolean => {
    return courses.find((e) => {
        return formatDateToBackend(e.date) === formatDateToBackend(date) && e.trainer?.id === trainerId;
    }) != undefined;
}