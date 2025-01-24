import { useEffect, useState } from "react";
import Header from "../components/Header";
import { ICourse } from "@/shared/types/course.type";
import { formatDate } from "@/shared/lib/utils/date";
import { useRouter } from "next/router";
import CourseForm from "@/components/forms/course";
import { whichNewType } from "@/shared/types";
import TrainerForm from "@/components/forms/trainer";
import { ITrainer } from "@/shared/types/trainer.type";
import { checkIfTrainerIsAvalaible, suggestQualifiedTrainer, wait } from "@/shared/lib/utils/utils";
import { signOut, useSession } from "next-auth/react";
import { IUser } from "@/shared/types/user.type";

export default function Courses() {
  const router = useRouter();

  const [success, setSuccesss] = useState<String | undefined>();
  const [errors, setErrors] = useState<String | undefined>();
  const [courseList, setCourseList] = useState<ICourse[]>([]);
  const [trainerList, setTrainerList] = useState<ITrainer[]>([]);
  const [whichNew, setWhichNew] = useState<whichNewType>();
  const [courseSelected, setCourseSelected] = useState<ICourse>();
  const [trainerSelected, setTrainerSelected] = useState<ITrainer>();
  const [user, setUser] = useState<IUser>();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      await getCourses();
      await getTrainers();
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (session && session.user) {
      const u: any = session.user;
      setUser(u.dataValues as IUser);
    }
  }, [session]);

  const getCourses = async () => {
    await fetch('/api/courses').then(async (e) => {
      const data = await e.json();
      setCourseList(data);
    });
  }

  const getTrainers = async () => {
    await fetch('/api/trainers').then(async (e) => {
      const data = await e.json();
      setTrainerList(data);
    });
  }

  const onChangeTrainer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [courseId, trainerId] = e.target.value.split("-");
  
    const course = courseList.find((e: ICourse) => e.id == Number(courseId));
    if (course && checkIfTrainerIsAvalaible(courseList, Number(trainerId), course.date)) {
      setErrors("Trainer is not available for the selected course date.");
    }

    const trainer = trainerList.find((e: ITrainer) => e.id == Number(trainerId));
    setTrainerSelected(trainer);
    setCourseSelected(course);

    wait(5000).then(() => {
      setErrors(undefined);
      setSuccesss(undefined);
    });
  };

  const asignTrainer = async () => {
    const data = { courseId: courseSelected?.id, trainerId: trainerSelected?.id };

    const waiting = () => {
      wait(5000).then(() => {
        setErrors(undefined);
        setSuccesss(undefined);
      });
    }

    if (courseSelected && trainerSelected && checkIfTrainerIsAvalaible(courseList, Number(trainerSelected.id), courseSelected.date)) {
      setErrors("Trainer is not available for the selected course date.");
      waiting();
    }

    await fetch('/api/trainers/asign', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(async (e) => {
      if (e.ok) {
        setSuccesss("Trainer assigned successfully.");
      } else {
        setErrors("Failed to assign trainer.");
      }
    });

    getCourses();

    wait(5000).then(() => {
      setErrors(undefined);
      setSuccesss(undefined);
    });
  }

  const formatTrainer = (list: ITrainer[], course: any) => {
    const newList = suggestQualifiedTrainer(list, { location: course.location, subject: course.subject });
    
    return newList.map((e) => ({
      id: e.id,
      name: `${e.name} - ${e.location} - ${e.trainingSubjects.join(',')}`,
      trainingSubjects: e.trainingSubjects,
      price: e.price,
      email: e.email
    }));
  }

  const handleSignOut = async () => {
    // Add sign-out logic here
    console.log("User signed out");
    await signOut();
  };
  
  return (
    <div>
      <Header user={user?.username} onSignOut={handleSignOut} />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Courses</h1>
        <div className="card mb-3">
          {success && (
            <div className="p-4 mb-2 text-lg font-semibold text-white bg-green-500 rounded-md w-full">
              {success && <div className="text-sm">{success}</div>}
            </div>
          )}
          {errors && (
            <div className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md w-full">
              {errors && <div className="text-sm">{errors}</div>}
            </div>
          )}
          <div className="flex flex-1 justify-end my-3">
            <div className="flex space-x-4">
              <button onClick={() => setWhichNew("course")} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                New Course
              </button>
              {/* <button onClick={() => setWhichNew("trainer")} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                New Trainer
              </button> */}
            </div>
          </div>
          {whichNew === "course" ? <CourseForm courseList={courseList} setCourseList={setCourseList} setWhichNew={setWhichNew} setErrors={setErrors} setSuccesss={setSuccesss} /> : ""}
          {/* {whichNew === "trainer" ? <TrainerForm setTrainerList={setTrainerList} setWhichNew={setWhichNew} setErrors={setErrors} setSuccesss={setSuccesss} /> : ""} */}
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 border-b">Course Name</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Subject</th>
              <th className="py-3 px-4 border-b">Location</th>
              <th className="py-3 px-4 border-b">Trainer</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseList.map((course) => (
              <tr key={course.id}>
                <td className="py-3 px-4 border-b">{course.name}</td>
                <td className="py-3 px-4 border-b">{formatDate(course.date)}</td>
                <td className="py-3 px-4 border-b">{course.subject}</td>
                <td className="py-3 px-4 border-b">{course.location}</td>
                <td className="py-3 px-4 border-b">
                  {course.trainer ? (
                    <div>
                      <div>
                        <strong>{course.trainer.name}</strong>
                      </div>
                      <div>{course.trainer.trainingSubjects.join(", ")}</div>
                      <div>{course.trainer.email}</div>
                    </div>
                  ) : (
                    <span>No trainer assigned</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b flex space-x-2">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
                    Delete
                  </button>
                  {course.trainer ? (
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600">
                      Remove Trainer
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <select className="border border-gray-300 px-4 py-2 rounded-lg shadow-md" onChange={onChangeTrainer}>
                          <option value="">Select Trainer</option>
                          {formatTrainer(trainerList, { location: course.location, subject: course.subject }).map((trainer) => (
                            <option key={trainer.id} value={`${course.id}-${trainer.id}`}>
                              {trainer.name}
                            </option>
                          ))}
                        </select>
                        <button onClick={() => asignTrainer()} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                          Assign Trainer
                        </button>
                      </div>
                      {success && (
                        <div className="mb-2 font-semibold text-green-500 rounded-md w-full">
                          {success && <div className="text-sm">{success}</div>}
                        </div>
                      )}
                      {errors && (
                        <div className="mb-2 font-semibold text-red-500 rounded-md w-full">
                          {errors && <div className="text-sm">{errors}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
