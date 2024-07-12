import React, { useContext, useEffect, useState } from "react";
// import { useUserProfileContext } from "../hooks/useUserProfileContext";

// components
import ProfileDetails from "../components/ProfileDetails";
import ProfileTabs from "../components/ProfileTabs";
import MyContext from "../MyContext";
import { useParams } from "react-router-dom";

const Profile = () => {
  // const { userProfile, dispatch } = useUserProfileContext();
  const { user } = useContext(MyContext);
  const { id } = useParams();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const json = await response.json();
        setProfile(json);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };
    fetchUserProfile();
  }, [id, user.token]);

  return (
    <div className="profile">
      <div className="details">
        {profile ? (
          <ProfileDetails profile={profile} />
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
      {profile ? <ProfileTabs profile={profile} /> : <p>Loading profile...</p>}
    </div>
  );
};

export default Profile;
