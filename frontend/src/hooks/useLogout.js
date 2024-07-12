import { useNavigate } from "react-router-dom";
import { useUserProfileContext } from "./useUserProfileContext";
import { useContext } from "react";
import MyContext from "../MyContext";

export const useLogout = () => {
  const { setIsLoggedIn } = useContext(MyContext);
  const { dispatch: workoutsDispatch } = useUserProfileContext();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);

    // dispatch logout action
    workoutsDispatch({ type: "SET_PROFILES", payload: null });
  };

  return { logout };
};
