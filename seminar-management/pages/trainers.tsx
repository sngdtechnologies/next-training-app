import { useEffect, useState } from "react";
import Header from "../components/Header";
import { signOut, useSession } from "next-auth/react";
import { IUser } from "@/shared/types/user.type";
import { ITrainer } from "@/shared/types/trainer.type";
import TrainerForm from "@/components/forms/trainer";
import { whichNewType } from "@/shared/types";

export default function Trainers() {
  const [trainerList, setTrainerList] = useState<ITrainer[]>([]);
  const [user, setUser] = useState<IUser>();
  const { data: session } = useSession();
  const [success, setSuccesss] = useState<String | undefined>();
  const [errors, setErrors] = useState<String | undefined>();
  const [whichNew, setWhichNew] = useState<whichNewType>();

  useEffect(() => {
    async function fetchData() {
      await getTrainers();
    }
    fetchData();
  }, []);

  const getTrainers = async () => {
    await fetch('/api/trainers').then(async (e) => {
      const data = await e.json();
      setTrainerList(data);
    });
  }
  
  useEffect(() => {
    if (session && session.user) {
      const u: any = session.user;
      setUser(u.dataValues as IUser);
    }
  }, [session]);

  const handleSignOut = async () => {
    // Add sign-out logic here
    console.log("User signed out");
    await signOut();
  };

  return (
    <div>
      <Header user={user?.username} onSignOut={handleSignOut} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Trainers</h1>
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
        <button onClick={() => setWhichNew("trainer")} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Create Trainer
        </button>
        {whichNew === "trainer" ? <TrainerForm setTrainerList={setTrainerList} setWhichNew={setWhichNew} setErrors={setErrors} setSuccesss={setSuccesss} /> : ""}
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="w-full bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Trainer Name
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Subjects
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Location
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {trainerList.map((trainer) => (
                <tr key={trainer.id} className="border-b">
                  <td className="py-3 px-4">{trainer.name}</td>
                  <td className="py-3 px-4">
                    {trainer.trainingSubjects.join(", ")}
                  </td>
                  <td className="py-3 px-4">{trainer.location}</td>
                  <td className="py-3 px-4">
                    <a
                      href={`mailto:${trainer.email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {trainer.email}
                    </a>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
