import { useFormStatus } from "@/shared/lib/utils/form";
import { wait } from "@/shared/lib/utils/utils";
import { TrainerFormProps } from "@/shared/types";
import { ITrainer } from "@/shared/types/trainer.type";
import dayjs from "dayjs";
import { useState } from "react";

const defaultData = {
    name: "",
    trainingSubjects: [],
    location: "",
    price: 0,
    email: ""
};

const TrainerForm = ({ setTrainerList, setWhichNew, setSuccesss, setErrors }: TrainerFormProps) => {
    const [data, setData] = useState<ITrainer>(defaultData);
    const { status, startPending, setSuccess, setError, resetStatus } = useFormStatus();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startPending();

        try {
            await fetch("/api/trainers", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(async (e) => {
                if (e.ok) {
                    wait(2000);
                    setSuccess();
                    setSuccesss("Trainer is created successfully");
                    setData(defaultData);
                    setWhichNew(undefined);
                    await fetch('/api/trainers').then(async (e) => {
                        const data = await e.json();
                        setTrainerList(data);
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

    const onTrainingSubjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const selectedValues = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedValues.push(options[i].value);
            }
        }
        setData({ ...data, trainingSubjects: selectedValues });
    }

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
                        placeholder="Enter name of trainer"
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
                        placeholder="Enter price of trainer"
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
                        placeholder="Enter location of trainer"
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-medium mb-2"
                    >
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter email of trainer"
                    />
                </div>
                <div>
                    <label
                        htmlFor="trainingSubjects"
                        className="block text-gray-700 text-sm font-medium mb-2"
                    >
                        Training subjects:
                    </label>
                    <select
                        id="trainingSubjects"
                        name="trainingSubjects"
                        multiple
                        value={data.trainingSubjects}
                        onChange={onTrainingSubjectsChange}
                        className="px-4 py-2 rounded-lg shadow-md"
                    >
                        <option value="React.js">React.js</option>
                        <option value="Next.js">Next.js</option>
                        <option value="Vue js">Vue js</option>
                    </select>
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

export default TrainerForm;