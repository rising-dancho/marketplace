import { Route, Navigate, Routes } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";

// pages & components
import MyContext from "./MyContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ListingScreen from "./pages/ListingScreen";
import AddListing from "./pages/AddListing";
import searchTermContext from "./context/searchTermContext";
import ViewListing from "./pages/ViewListing";
import ChatBox from "./components/ChatBox";
import { socket } from "./socket";
import ChatHistoryScreen from "./pages/ChatHistoryScreen";
import EditReview from "./pages/EditReview";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  const { user } = useContext(MyContext);
  const { isLoggedIn } = useContext(MyContext);
  let [searchTerm, setSearchTerm] = useState("");
  const search = { searchTerm, setSearchTerm };
  let firstRun = useRef(true);
  useEffect(() => {
    if (!firstRun.current) {
      if (user) {
        socket.emit("join", user.id);
      }
    } else {
      firstRun.current = false;
    }
  }, [user]);
  return (
    <div className="App">
      <ErrorBoundary>
        <searchTermContext.Provider value={search}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  isLoggedIn ? <ListingScreen /> : <Navigate to="/login" />
                }
              />
              <Route
                path="profile/:id"
                element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="settings"
                element={
                  isLoggedIn ? <Settings /> : <Navigate to="/settings" />
                }
              />
              <Route
                path="login"
                element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="signup"
                element={!isLoggedIn ? <Signup /> : <Navigate to="/" />}
              />
              <Route path="/search/" element={<ListingScreen />} />
              <Route path="/addListing" element={<AddListing />} />
              <Route path="/editListing/:id" element={<AddListing />} />
              <Route path="/viewListing/:id" element={<ViewListing />} />
              <Route path="/messages" element={<ChatHistoryScreen />} />
              <Route path="/messages/:id" element={<ChatBox />} />
              <Route path="/edit-review" element={<EditReview />} />
            </Route>
          </Routes>
        </searchTermContext.Provider>
      </ErrorBoundary>
    </div>
  );
}

export default App;

// references:
// static navigation logic: https://www.youtube.com/watch?v=LDB4uaJ87e0&t=4681s
// modification: https://chatgpt.com/share/3e6b1017-4213-481f-9a6c-52999d2cf484
