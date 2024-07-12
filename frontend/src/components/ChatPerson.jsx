import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatPerson = ({userInfo})=>{
    const navigate = useNavigate();
    const [image, setImage] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(()=>{
        if(userInfo){
            if(userInfo.image[0]!=null){
                setImage(userInfo.image[0].path)
            }
            setUserName(userInfo.username);
        }
    }, [])
    return(
        <div className="chatPersonDiv" onClick={()=>{navigate("/messages/"+userInfo._id, {state:userInfo})}}>
            <img src={image} className="chatPicture"></img>
            <h3>{userName}</h3>
        </div>
    );
}

export default ChatPerson