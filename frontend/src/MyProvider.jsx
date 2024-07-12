import { useState } from "react";
import MyContext from "./MyContext";

const MyProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") ? true : false
  );
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : undefined
  );
  const [reload, setReload] = useState(false);

  const [current, setCurrent] = useState(
    localStorage.getItem("current")
      ? JSON.parse(localStorage.getItem("current"))
      : {}
  );

  const state = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    reload,
    setReload,
    current,
    setCurrent,
  };

  return (
    <MyContext.Provider value={state}>{props.children}</MyContext.Provider>
  );
};

export default MyProvider;
