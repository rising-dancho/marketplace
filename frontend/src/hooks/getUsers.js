import axios from "axios";

const getUsers = async () => {
  const users = await axios.get(
    `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/profile`
  );

  const usernames = users.data.data.map((item) => {
    const image = item.image[0] || "";
    return {
      userID: item._id,
      username: item.username,
      profileIMG: image.path || "",
    };
  });
  localStorage.setItem("usernames", JSON.stringify(usernames));
};

export default getUsers;
