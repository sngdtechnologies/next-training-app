import { formatDateToBackend } from "@/shared/lib/utils/date";
import { useFormStatus } from "@/shared/lib/utils/form";
import { checkIfAnotherCourseHaveSameDateAndLocation, wait } from "@/shared/lib/utils/utils";
import { CourseFormProps } from "@/shared/types";
import { ICourse } from "@/shared/types/course.type";
import dayjs from "dayjs";
import { useState } from "react";

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

const CourseForm = ({ courseList, setCourseList, setWhichNew, setSuccesss, setErrors }: CourseFormProps ) => {
    const [data, setData] = useState<ICourse>(defaultData);
    const { status, startPending, setSuccess, setError, resetStatus } = useFormStatus();
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startPending();

        try {
            if (checkIfAnotherCourseHaveSameDateAndLocation(courseList, data)) {
                setErrors("Another course is already scheduled at the same date and location");
                return null;
            }

            if (data.price < 0) {
                setErrors("Price cannot be negative");
                return null;
            }

            const datab = {
                ...data,
                date: formatDateToBackend(data.date)
            };

            await fetch("/api/courses", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datab)
            }).then(async (e) => {
                if (e.ok) {
                    wait(2000);
                    setSuccess();
                    setSuccesss("Course is created successfully");
                    setData(defaultData);
                    setWhichNew(undefined);
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

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                        onChange={(e) => setData({ ...data, name: e.target.value })}
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
                        onChange={(e) => setData({ ...data, subject: e.target.value })}
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
                        onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
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
                        onChange={(e) => setData({ ...data, date: dayjs(e.target.value) })}
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
                        onChange={(e) => setData({ ...data, notes: e.target.value })}
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
                        onChange={(e) => setData({ ...data, location: e.target.value })}
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
                        onChange={(e) => setData({ ...data, participants: Number(e.target.value) })}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter participants of course"
                    />
                </div>
            </div>
            <div className="flex flex-2 justify-start my-3 space-x-4">
                <button type="submit" disabled={status === 'pending'} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                    Register
                </button>
                <button type="reset" onClick={() => setWhichNew(undefined)} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                    Annuler
                </button>
            </div>
        </form>
    );
};

export default CourseForm;