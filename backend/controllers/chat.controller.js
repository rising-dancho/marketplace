import { asyncHandler } from "../middleware/errorHandler.js";
import messages from "../models/message.model.js";

const getAllChatHistoryWithUser = asyncHandler(async(req, res, next)=>{
    const {fromUser, toUser} = req.body
    const history = await messages.find({$or:[{$and:[{fromUser:fromUser}, {toUser:toUser}]},{$and:[{fromUser:toUser}, {toUser:fromUser}]} ]});
    res.status(200).send({data:history});
});

const getAllSelectedUserChatHistory = asyncHandler(async(req, res, next)=>{
    const {selectedUser} = req.body
    const history = await messages.find({$or:[{fromUser:selectedUser},{toUser:selectedUser}]}).sort({createDate:-1});
    // const notFromnotTo = [...history.filter((item)=>item.fromUser!=selectedUser), ...history.filter((item)=>item.toUser!=selectedUser)]
    let notFrom =history.filter((item)=>item.fromUser!=selectedUser);
    notFrom = notFrom.map((item)=>item.fromUser.toString());
    let notTo =history.filter((item)=>item.toUser!=selectedUser);
    notTo = notTo.map((item)=>item.toUser.toString());
    let idsTalkedto = [...notFrom, ...notTo];
    const conversationPartners = idsTalkedto.filter((id, index ,arr)=>arr.indexOf(id)===index);
    res.status(200).send({data:conversationPartners});
})

export {getAllChatHistoryWithUser, getAllSelectedUserChatHistory};