import { Dispatch, SetStateAction } from "react";
import { ICourse } from "./course.type";
import { ITrainer } from "./trainer.type";

export interface CourseFormProps { 
    courseList: ICourse[],
    setCourseList: Dispatch<SetStateAction<ICourse[]>>, 
    setWhichNew: Dispatch<SetStateAction<whichNewType>> ,
    setErrors: Dispatch<SetStateAction<String | undefined>>,
    setSuccesss: Dispatch<SetStateAction<String | undefined>>
};

export interface TrainerFormProps { 
    setTrainerList: Dispatch<SetStateAction<ITrainer[]>>, 
    setWhichNew: Dispatch<SetStateAction<whichNewType>> ,
    setErrors: Dispatch<SetStateAction<String | undefined>>,
    setSuccesss: Dispatch<SetStateAction<String | undefined>>
};

export type whichNewType = "course" | "trainer" | undefined;