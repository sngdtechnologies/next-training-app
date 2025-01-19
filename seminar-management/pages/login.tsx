import { useFormStatus } from "@/shared/lib/utils/form";
import { wait } from "@/shared/lib/utils/utils";
import { IUser } from "@/shared/types/user.type";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [errors, setErrors] = useState<String | undefined>();
  const { status, startPending, setSuccess, setError, resetStatus } = useFormStatus();
  const [data, setData] = useState<IUser>({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startPending();
    try {
      const signInResponse = await signIn("credentials", {
        // ...data,
        username: "john.doe",
        password: "john123",
        redirect: false,
      });
      
      if (signInResponse && !signInResponse.error) {
        wait(2000);
        setSuccess();
        router.push("/");
      } else {
        setErrors("Username or password is incorrect");
        console.log("Error: ", signInResponse);
      }
    } catch (error) {
      setError();
    }

    wait(5000)
    resetStatus();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Login</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {errors && (
            <div className="p-4 mb-2 text-lg font-semibold text-white bg-red-500 rounded-md w-full">
              {errors && <div className="text-sm">{errors}</div>}
            </div>
          )}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Username:
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={data.username}
              onChange={(e) => setData({...data, username: e.target.value})}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData({...data, password: e.target.value})}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'pending'}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
