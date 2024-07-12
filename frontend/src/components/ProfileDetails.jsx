import React, { useContext, useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import no_avatar from "../images/no-avatar.svg";
import { useNavigate } from "react-router-dom";
import MyContext from "../MyContext";

const ProfileDetails = ({ profile }) => {
  const { user } = useContext(MyContext);
  const [necessaryChatInfo, setNecessaryChatInfo] = useState({});
  const [profileID, setProfileID] = useState("");
  const [isMe, setIsMe] = useState(true);
  const navigate = useNavigate();
  if (!profile) {
    return <div>Loading...</div>;
  }

  // Check to make sure that the image exists
  const imagePath =
    profile.image && profile.image.length > 0 ? profile.image[0].path : null;

  useEffect(() => {
    if (profile) {
      setNecessaryChatInfo({
        _id: profile._id,
        username: profile.username,
        image: profile.image,
      });
      setProfileID(profile._id);
      setIsMe(profile._id == user.id);
    }
  }, [profile]);

  return (
    <div className="sidebar">
      {profile.image ? (
        <Image cloudName="dexuiicai" publicId={imagePath} className="avatar" />
      ) : (
        <img src={no_avatar} alt="" className="avatar" />
      )}
      {!isMe && (
        <button
          onClick={() => {
            navigate("../messages/" + profileID, { state: necessaryChatInfo });
          }}
        >
          Send this user a message
        </button>
      )}
      <h2>
        {profile.firstname} {profile.lastname}
      </h2>
      <p>@{profile.username}</p>
      <p>
        <strong>Phone Number: </strong>
        {profile.phone}
      </p>
      <h4 className="meetupLocations">Meetup Locations:</h4>
      <ul>
        {/* Add a conditional check for meetupLocations */}
        {profile.meetupLocations && Array.isArray(profile.meetupLocations) ? (
          profile.meetupLocations.map((location, index) => (
            <li key={index}>{location}</li>
          ))
        ) : (
          <li>No meetup locations found</li>
        )}
      </ul>
    </div>
  );
};

export default ProfileDetails;
