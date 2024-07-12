import messages from "../models/message.model.js"

const logMessage=(msg)=>{
    const {fromUser, toUser, messageBody} = msg
    let newMessage = new messages({
        fromUser,
        toUser,
        messageBody,
    })
    newMessage.save();
}

export default logMessage;