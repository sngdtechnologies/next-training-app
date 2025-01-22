import { ICourse } from "@/shared/types/course.type";

export const formatCourses = (courses: ICourse[]) => {
    return courses.map((course: any) => ({
        id: course.id,
        name: course.name,
        date: course.date,
        subject: course.subject,
        location: course.location,
        participants: course.participants,
        notes: course.notes,
        price: course.price,
        trainer: course.Trainer != null ? {
            name: course.Trainer.name,
            trainingSubjects: course.Trainer.trainingSubjects,
            location: course.Trainer.location,
            email: course.Trainer.email,
        } : null
    }));
}

export const formatCourse = (course: any) => {
    return {
        id: course.id,
        name: course.name,
        date: course.date,
        subject: course.subject,
        location: course.location,
        participants: course.participants,
        notes: course.notes,
        price: course.price,
        trainer: course.trainerId != null ? {
            id: course.trainerId
        } : null
    };
}