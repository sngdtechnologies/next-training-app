import { useEffect, useState } from "react";
import Header from "../components/Header";
import { ICourse } from "@/shared/types/course.type";
import { formatDate, formatDateToBackend, getDate } from "@/shared/lib/utils/date";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useFormStatus } from "@/shared/lib/utils/form";
import { wait } from "@/shared/lib/utils/utils";

const defaultData = {
  name: "",
  date: dayjs(),
  subject: "",
  location: "",
  notes: "",
  participants: 0,
  price: 0,
  trainer: null
};

export default function Courses() {
  const router = useRouter();

  const [success, setSuccesss] = useState<String | undefined>();
  const [errors, setErrors] = useState<String | undefined>();
  const { status, startPending, setSuccess, setError, resetStatus } = useFormStatus();
  const [data, setData] = useState<ICourse>(defaultData);
  const [courseList, setCourseList] = useState<ICourse[]>([]);
  const [trainerList, setTrainerList] = useState<ICourse[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      await getCourses();
      await getTrainers();
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startPending();

    try {
      const datab = {
        ...data,
        date: formatDateToBackend(data.date)
      };
      
      await fetch("/api/courses", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body:  JSON.stringify(datab)
      }).then(async (e) => {
        if (e.ok) {
          wait(2000);
          setSuccess();
          setSuccesss("Course is created successfully");
          setData(defaultData);
          await fetch('/api/courses').then(async (e) => {
            const data = await e.json();
            setCourseList(data);
          });
        } else {
          setErrors("Expected erreor");
        }
      }); 
    } catch (error) {
      setError();
      setErrors("Expected erreor");
    }

    wait(5000)
    resetStatus();
  };

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

  return (
    <div>
      <Header user="John Doe" onSignOut={() => {}} />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Courses</h1>
        <div className="card mb-3">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Name:
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData({...data, name: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter name of course"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Subject:
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={data.subject}
                  onChange={(e) => setData({...data, subject: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter subject of course"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Price:
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={data.price}
                  onChange={(e) => setData({...data, price: Number(e.target.value)})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter price of course"
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Date:
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={data.date ? data.date.format('YYYY-MM-DD') : ''}
                  onChange={(e) => setData({...data, date: dayjs(e.target.value)})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter published date"
                />
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Notes:
                </label>
                <input
                  id="notes"
                  type="text"
                  name="notes"
                  value={data.notes}
                  onChange={(e) => setData({...data, notes: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter notes of course"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Location:
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={data.location}
                  onChange={(e) => setData({...data, location: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter location of course"
                />
              </div>
              <div>
                <label
                  htmlFor="participants"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Participants:
                </label>
                <input
                  id="participants"
                  type="number"
                  name="participants"
                  value={data.participants}
                  onChange={(e) => setData({...data, participants: Number(e.target.value)})}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter participants of course"
                />
              </div>
            </div>
            <div className="flex flex-1 justify-start my-3">
              <button type="submit" disabled={status === 'pending'} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                Register
              </button>
            </div>
          </form>
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
                    <div className="flex items-center space-x-2">
                      <select className="border border-gray-300 px-4 py-2 rounded-lg shadow-md">
                        <option value="">Select Trainer</option>
                        {trainerList.map((trainer) => (
                          <option key={trainer.id} value={trainer.id}>
                            {trainer.name}
                          </option>
                        ))}
                      </select>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                        Assign Trainer
                      </button>
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
