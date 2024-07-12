import React, { useContext, useEffect, useRef, useState } from "react";
import ReviewTabs from "./Review/ReviewTabs";
import axios from "axios";
import MyContext from "../MyContext";
import ListingItem from "./ListingItem";

function ProfileTabs({ profile }) {
  const { user } = useContext(MyContext);
  const [toggleState, setToggleState] = useState(1); // Initialize to a default value
  const [userListings, setUserListings] = useState([]);
  const firstRun = useRef(true);
  function handleTabToggle(index) {
    setToggleState(index);
  }
  async function getUserListings(id) {
    await axios
      .get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/users/` + id)
      .then((result) => {
        setUserListings(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    if (profile._id != null) {
      getUserListings(profile._id);
    } else {
      getUserListings(user.id);
    }
  }, [profile]);
  return (
    <div className="profile-tabs">
      <div className="header-tabs">
        <div
          onClick={() => handleTabToggle(1)}
          className={toggleState === 1 ? "tab active" : "tab"}
        >
          Listings
        </div>
        <div
          onClick={() => handleTabToggle(2)}
          className={toggleState === 2 ? "tab active" : "tab"}
        >
          Reviews
        </div>
      </div>

      <div className="content-tabs">
        <div className={toggleState === 1 ? "content active" : "content"}>
          <h2>Listings</h2>
          <div className="listingWindow">
            {userListings.map((listing, i) => (
              <ListingItem key={i} listing={listing} />
            ))}
          </div>
        </div>

        <div className={toggleState === 2 ? "content active" : "content"}>
          <h2>Reviews</h2>
          <ReviewTabs />
        </div>
      </div>
    </div>
  );
}

export default ProfileTabs;

// references for creating tabs:
// logic: https://www.youtube.com/watch?v=WkREeDy2WQ4
// design: https://www.youtube.com/watch?v=6aABomFC99o
// bugfix: https://stackoverflow.com/questions/21979185/disable-text-cursor-within-a-div
