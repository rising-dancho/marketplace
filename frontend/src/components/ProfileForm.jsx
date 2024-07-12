import React, { useState, useEffect, useContext } from "react";
import { useUserProfileContext } from "../hooks/useUserProfileContext";
import MyContext from "../MyContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const { userProfile, dispatch } = useUserProfileContext();
  const { user } = useContext(MyContext);
  let defaultImgURL = "/img/addImg.png";
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [meetupLocations, setMeetupLocations] = useState("");
  const [error, setError] = useState(null);
  const [displayImg, setDisplayImg] = useState(defaultImgURL);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  function getImgForEdit(image) {
    axios({
      url: image, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      setSelectedImage(response.data);
    });
  }
  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || "");
      setFirstname(userProfile.firstname || "");
      setLastname(userProfile.lastname || "");
      setPhone(userProfile.phone || "");
      setMeetupLocations(userProfile.meetupLocations || "");

      if (userProfile.image && userProfile.image.length > 0) {
        getImgForEdit(userProfile.image[0].path);
        setDisplayImg(userProfile.image[0].path);
      } else {
        setDisplayImg(defaultImgURL);
      }
    }
  }, [userProfile]);
  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setDisplayImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const data = new FormData();
    data.append("username", username);
    data.append("firstname", firstname);
    data.append("lastname", lastname);
    data.append("phone", phone);
    meetupLocations.forEach((location) => {
      data.append("meetupLocations", location);
    });

    if (selectedImage) {
      data.append("profile-img", selectedImage);
    }

    const url = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/profile/${
      user.id
    }`;
    axios
      .put(url, data, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((result) => {
        dispatch({ type: "SET_USER_PROFILE", payload: result.data.data });
        navigate("../profile/" + user.id);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Profile</h3>

      <div className="upload-image-container">
        <input
          type="file"
          id="profileImgInput"
          onChange={handleFileChange}
          className="imgUpload"
        />
        <div className="img-details">
          <label>ProfilePhoto</label>
          <label htmlFor="profileImgInput">
            <img src={displayImg} className="uploadThumb" />
          </label>
        </div>
        <div className="desc-details">
          <p>
            Clear frontal face photos are an important way for buyers and
            sellers to learn about each other.
          </p>
        </div>
      </div>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        required
      />

      <label>Firstname:</label>
      <input
        type="text"
        onChange={(e) => setFirstname(e.target.value)}
        value={firstname}
        required
      />

      <label>Lastname:</label>
      <input
        type="text"
        onChange={(e) => setLastname(e.target.value)}
        value={lastname}
        required
      />

      <label>Phone:</label>
      <input
        type="text"
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
        required
      />

      <label>Meetup Locations:</label>
      <input
        type="text"
        onChange={(e) => setMeetupLocations(e.target.value.split(","))}
        value={meetupLocations}
      />

      <button type="submit">Update Profile</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ProfileForm;
