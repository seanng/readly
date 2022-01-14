import { useForm } from "react-hook-form";
import axios from "axios";
import { EMAIL_REGEX } from "shared/constants";

const CHROME_RUNTIME_NOT_FOUND = "chrome runtime not found";

export default function Signup() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (input: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      const { data } = await axios.post("/api/signup", input);
      // save jwt to cookie?
      // https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81
      const payload = {
        token: data.token,
        email: input.email,
        // add user info
      };
      if (!chrome?.runtime?.sendMessage) {
        throw new Error(CHROME_RUNTIME_NOT_FOUND);
      }
      chrome.runtime.sendMessage(
        process.env.NEXT_PUBLIC_EXTENSION_ID,
        payload,
        function onSendSuccess(message) {
          if (message.success) {
            // do something
          } else {
            // do something else
          }
        }
      );
    } catch (error) {
      if (error.message === CHROME_RUNTIME_NOT_FOUND) {
        console.log(CHROME_RUNTIME_NOT_FOUND);
      }
    }
  };

  return (
    <div className="flex justify-center px-8 pt-8">
      <div className="w-full max-w-s">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              {...register("email", {
                // required: true,
                // pattern: {
                //   value: EMAIL_REGEX,
                //   message: "Enter a valid email address",
                // },
              })}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              {...register("password", {
                // required: true,
                // minLength: {
                //   value: 6,
                //   message: "Password must have at least 6 characters",
                // },
              })}
            />
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
