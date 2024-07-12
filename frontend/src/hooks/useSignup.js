import { useState } from "react";
import useLogin from "./useLogin";

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, login] = useLogin();

  const signup = async (
    email,
    password,
    username,
    firstname,
    lastname,
    phone
  ) => {
    try {
      e.preventDefault();

      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/users/register`,
        {
          username,
          email,
          password,
          firstname,
          lastname,
          phone,
        }
      );

      login(e, { email, password });
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    }
    return { signup };
  };
};
