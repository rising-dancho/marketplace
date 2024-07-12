import { Schema, model } from "mongoose";
import MongooseDelete from "mongoose-delete";

const messageSchema = new Schema({
    fromUser:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true, "UserID is required"],
    },
    toUser:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true, "UserID is required"],
    },
    messageBody:String,
    deleted:{
        type:Boolean,
        default:false,
    },
    createDate:{
        type:Date,
        default:Date.now
    }
},
    {
        timestamps:true,
    }
)
messageSchema.plugin(MongooseDelete);

const messages = model("Message", messageSchema, "messages");
export default messages;