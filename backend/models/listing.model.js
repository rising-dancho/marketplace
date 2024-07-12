import { Schema, model } from "mongoose";
import MongooseDelete from "mongoose-delete";

const listingSchema = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:[true, "UserID is required"],
    },
    title:{
        type:String,
        required:[true, "Item Name is required"],
    },
    description:{
        type:String,
        required:[true, "Description is required"],
    },
    price:{
        type:Number,
        required:[true, "Price is required"],
    },
    image:[{
        path:String,
        filename:String
    }],
    category:{
        type:String,
        required:[true, "Category is required"],
    },
    isSold:{
        type:Boolean,
        required:[true, "Need to know if sold or not"]
    },
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
listingSchema.plugin(MongooseDelete);

const listings = model("Listing", listingSchema, "listings");
export default listings;