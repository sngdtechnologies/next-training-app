import { Dispatch, SetStateAction } from "react";
import { ICourse } from "./course.type";

export interface CourseFormProps { 
    setCourseList: Dispatch<SetStateAction<ICourse[]>>, 
    setWhichNew: Dispatch<SetStateAction<whichNewType>> 
};

export type whichNewType = "course" | "trainer" | undefined;