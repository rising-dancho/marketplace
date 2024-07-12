import listings from "../models/listing.model.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { cloudinary } from "../config/listingStorage.js";

const getListings = asyncHandler(async(req, res, next)=>{
    const allListings = await listings.find({deleted:{$ne:true}}).populate({path:"userID", select:["_id", "email", "username", "phone", "image"]});
    res.status(200).send({message:"Retrieved all listings", data:allListings});
});

const searchForListing = asyncHandler(async(req, res, next)=>{
    const searchTerm = new RegExp(req.params.searchTerm, "i");
    const searchedListings = await listings.find({$and:[{$or:[{title:{$regex:searchTerm}}, {description:{$regex:searchTerm}}]}, {deleted:{$ne:true}}]}).populate({path:"userID", select:["_id", "email", "username", "phone", "image"]});
    res.status(200).send({message:"Retrieved all listings", data:searchedListings});
});

const listingOfUser = asyncHandler(async(req, res, next)=>{
    const {id}=req.params;
    const allListings = await listings.find({$and:[{deleted:{$ne:true}}, {userID:id}]}).populate({path:"userID", select:["_id", "email", "username", "phone", "image"]});
    res.status(200).send({message:"Retrieved all user listings", data:allListings});
});

const addListing = asyncHandler(async(req, res, next)=>{
    const {userID, title, description, price, category, isSold, createDate} = req.body;
    let newListing;
    if(req.files){
        newListing = new listings({
            userID,
            title,
            description,
            price,
            image:req.files.map((image)=>{return {
                path:image.path,
                filename:image.filename
            }}),
            category,
            isSold,
            createDate
        })
    }
    else{
        newListing = new listings({
            userID,
            title,
            description,
            price,
            category,
            isSold,
            createDate
        })
    }
    await newListing.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).send({message:"New listing posted!", data:newListing});
})

const viewOneListing = asyncHandler(async(req, res, next)=>{
    const selectedListing = await listings.findOne({_id:req.params.id}).populate({path:"userID", select:["username", "image"]});
    res.status(200).send({message:"Retrieved Listing", data:selectedListing});
})

const editListing = asyncHandler(async(req, res, next)=>{
    const listingID = req.params.id;
    const target = await listings.findOne({_id:listingID});
    if(target){
        const {title, description, price, category, isSold}=req.body;
        async function updateEntry(){
            await listings.updateOne({_id:listingID},{
                $set:{
                    title,
                    description,
                    price,
                    category,
                    isSold,
                    image:req.files.map((image)=>{return {
                        path:image.path,
                        filename:image.filename
                    }}),
                }
            })
        }
        target.image.forEach(async (image)=>{
            const cloudDelete = await cloudinary.uploader.destroy(image.filename);
        })
        updateEntry();
        const result = await listings.findOne({_id:listingID}).populate({path:"userID", select:["_id", "email"]});
        res.status(200).send({message:"Listing Edited", data:result});  
    }
    else{
        res.status(404).send({Message:"Target not found"});
    }
})

const markListingSold = asyncHandler(async(req, res, next)=>{
    const listingID = req.params.id;
    const target = await listings.findOne({_id:listingID});
    const isSold = true;
    if(target){
        async function updateEntry(){
            await listings.updateOne({_id:listingID},{
                $set:{
                    isSold,
                }
            })
        }
        updateEntry();
        res.status(200).send({message:"Marked as sold!"});  
    }
    else{
        res.status(404).send({Message:"Target not found!"});
    }
})

const deleteListing = asyncHandler(async(req, res, next)=>{
    const listingID = req.params.id;
    const target = await listings.findOne({_id:listingID});
    if(target){
        await listings.delete({_id:listingID});
        res.status(200).send({Message:"Listing has been deleted"});
    }
    else{
        res.status(404).send({message:"Listing not found"});
    }
})
export {getListings, addListing, listingOfUser, viewOneListing, editListing, searchForListing, deleteListing, markListingSold};