import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useContext, useEffect, useRef, useState } from "react";
import searchTermContext from "../context/searchTermContext";
import { useUserProfileContext } from "../hooks/useUserProfileContext";
import no_avatar from "../images/no-avatar.svg";
import { Image } from "cloudinary-react";

// react-icons
import {
  FaUser,
  FaGear,
  FaArrowRightFromBracket,
  FaChevronDown,
  FaComment,
} from "react-icons/fa6";
import { socket } from "../socket";
import MyContext from "../MyContext";
import axios from "axios";

const Navbar = () => {
  const { logout } = useLogout();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const { userProfile, dispatch } = useUserProfileContext();
  const [searchText, setSearchText] = useState("");
  const { searchTerm, setSearchTerm } = useContext(searchTermContext);
  const [profileImage, setProfileImage] = useState(null);
  const [displayUsername, setDisplayUsername] = useState("");
  // dropdown menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  let firstRun = useRef(true);
  const chatDefaultIconClass = "react-icons standardSize noNew";
  const chatNotifIconClass = "react-icons standardSize newChat";
  let [chatIconClass, setChatIconClass] = useState(chatDefaultIconClass);
  const handleSearch = () => {
    if (searchText !== searchTerm) {
      setSearchTerm(searchText);
    } else {
      navigate("/search/");
    }
  };
  const handleEnterKeySearch = (e) => {
    if (e.keyCode == 13) {
      if (searchText !== searchTerm) {
        setSearchTerm(searchText);
      } else {
        navigate("/search/");
      }
    }
  };

  useEffect(() => {
    if (!firstRun.current) {
      navigate("/search/");
    } else {
      firstRun.current = false;
    }
  }, [searchTerm]);

  useEffect(() => {
    if (user && user.token) {
      const fetchProfile = async () => {
        await axios
          .get(
            `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/profile/${user.id}`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          )
          .then((result) => {
            dispatch({ type: "SET_USER_PROFILE", payload: result.data });
          });
      };

      fetchProfile();
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // menu buttons
  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!firstRun.current) {
      if (userProfile) {
        if (userProfile.image[0] != undefined) {
          setDisplayUsername(userProfile.username);
          setProfileImage(userProfile.image[0].path);
        }
      }
    }
  }, [userProfile]);

  useEffect(() => {
    socket.on("pvt_msg", (data) => {
      setChatIconClass(chatNotifIconClass);
    });
  }, []);
  return (
    <header>
      <div className="container">
        <button
          className="TMIconButton"
          onClick={() => {
            if (searchTerm) {
              setSearchTerm("");
              setSearchText("");
            } else {
              navigate("/");
            }
          }}
        >
          <h1 className="noPointers">TM!</h1>
        </button>
        <div className="searchDiv">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              handleEnterKeySearch(e);
            }}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <nav>
          {isLoggedIn && (
            <FaComment
              className={chatIconClass}
              onClick={() => {
                navigate("/messages");
                setChatIconClass(chatDefaultIconClass);
              }}
            />
          )}
          <button onClick={() => navigate("/addListing")}>
            Have something to sell?
          </button>
          {isLoggedIn ? (
            <div ref={menuRef}>
              <button
                className="drop-down-menu custom-link outline"
                onClick={toggleMenu}
              >
                {displayUsername}
                {/* Show user avatar if available */}
                {profileImage ? (
                  <img src={profileImage} />
                ) : (
                  <img src={no_avatar} alt="avatar" />
                )}
                <FaChevronDown className="react-icons icon-small" />
              </button>
              <div
                className={`sub-menu-wrap ${menuOpen ? "open-menu" : ""}`}
                id="subMenu"
              >
                <div className="sub-menu">
                  <div
                    className="sub-menu-link"
                    onClick={() => {
                      handleMenuItemClick();
                      navigate("/profile/" + user.id);
                    }}
                  >
                    <FaUser className="react-icons" />
                    <p>Profile</p>
                  </div>
                  <Link
                    to="/settings"
                    className="sub-menu-link"
                    onClick={handleMenuItemClick}
                  >
                    <FaGear className="react-icons" />
                    <p>Settings</p>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      handleLogout();
                      handleMenuItemClick();
                    }}
                    className="sub-menu-link"
                  >
                    <FaArrowRightFromBracket className="react-icons" />
                    <p>Logout</p>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Link to="/login" className="custom-link outline">
                Login
              </Link>
              <Link to="/signup" className="custom-link outline">
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
