import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatPerson from "../components/ChatPerson";
import MyContext from "../MyContext";
import { useNavigate } from "react-router-dom";

const ChatHistoryScreen = () => {
  const { user } = useContext(MyContext);
  const navigate = useNavigate();
  let [chatUsers, setChatUsers] = useState([]);
  let [chatUserIDs, setChatUserIDs] = useState([]);
  let firstRun = useRef(true);
  async function getChatHistory() {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/chat/getUserChatHistory/`,
        { selectedUser: user.id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((result) => {
        setChatUserIDs(result.data.data);
      });
  }
  async function getTargetUser() {
    let tempArray = [...chatUsers];
    for await (const userID of chatUserIDs) {
      await axios
        .get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/user/profile/` + userID
        )
        .then((result) => {
          tempArray.push(result.data);
        })
        .catch((error) => {
          console.log("Deleted User ID detected");
        });
    }
    setChatUsers(tempArray);
  }
  useEffect(() => {
    getChatHistory();
  }, []);
  useEffect(() => {
    if (!firstRun.current) {
      getTargetUser();
    } else {
      firstRun.current = false;
    }
  }, [chatUserIDs]);
  return (
    <div className="chatHistoryScreenDiv">
      <div>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          ← Home
        </button>
      </div>
      {chatUsers.map((userInfo, i) => (
        <ChatPerson key={i} userInfo={userInfo} />
      ))}
    </div>
  );
};
export default ChatHistoryScreen;
