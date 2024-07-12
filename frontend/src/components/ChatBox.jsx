import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import MyContext from "../MyContext";
import { FaCircleRight } from "react-icons/fa6";
const ChatBox = () => {
  const { user } = useContext(MyContext);
  let location = useLocation();
  const [destination, setDestination] = useState(location.state);
  let [msgBody, setMsgBody] = useState("");
  let firstRun = useRef(true);
  let [chatHistory, setChatHistory] = useState([]);
  let [historyWindow, setHistoryWindow] = useState(
    document.getElementById("chatHistoryContent")
  );
  let [DImage, setDImage] = useState("");
  let [DUsername, setDUsername] = useState("");
  const toUserClass = "toUserBaloon";
  const fromUserClass = "fromUserBaloon";
  const navigate = useNavigate();
  function sendMessage(e) {
    if (e.keyCode == 13 && msgBody != "") {
      setMsgBody("");
      socket.emit("newMsg", {
        fromUser: user.id,
        toUser: destination._id,
        messageBody: msgBody,
      });
      getHistory();
    }
  }
  function sendMessageButton() {
    if (msgBody != "") {
      setMsgBody("");
      socket.emit("newMsg", {
        fromUser: user.id,
        toUser: destination._id,
        messageBody: msgBody,
      });
      getHistory();
    }
  }
  async function getHistory() {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/chat/getHistory/`,
        {
          fromUser: user.id,
          toUser: destination._id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((result) => {
        setChatHistory(result.data.data);
      });
  }

  useEffect(() => {
    getHistory();
    socket.on("pvt_msg", (data) => {
      getHistory();
    });
    setDImage(destination.image[0].path);
    setDUsername(destination.username);
  }, []);
  useEffect(() => {
    setHistoryWindow(document.getElementById("chatHistoryContent"));
    if (!firstRun.current) {
      if (user) {
        socket.emit("join", user.id);
      }
      historyWindow.scrollTop = historyWindow.scrollHeight;
    } else {
      firstRun.current = false;
      console.log(user.id);
    }
  }, [chatHistory]);
  return (
    <div className="chatHistory">
      <div>
        <button
          className="historyBackButton"
          onClick={() => {
            navigate("/");
          }}
        >
          ← Home
        </button>
      </div>
      <header className="chatHistoryHeader">
        <img src={DImage} className="chatPicture"></img>
        <h3>{DUsername}</h3>
      </header>
      <div className="chatHistoryContent" id="chatHistoryContent">
        {chatHistory.map((message) => (
          <div
            className={
              message.fromUser == user.id ? fromUserClass : toUserClass
            }
          >
            <h3>{message.messageBody}</h3>
          </div>
        ))}
      </div>
      <footer className="chatInputFooter">
        <input
          type="text"
          className="chatInput"
          value={msgBody}
          onChange={(e) => {
            setMsgBody(e.target.value);
          }}
          onKeyDown={(e) => {
            sendMessage(e);
          }}
          placeholder="Type out a message!"
        ></input>
        <FaCircleRight className="sendChatButton" onClick={sendMessageButton} />
      </footer>
    </div>
  );
};

export default ChatBox;
