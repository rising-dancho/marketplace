import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ListingItem = (listing)=>{
    const item = listing.listing;
    const navigate = useNavigate();
    function gotoListing(){
        navigate("../viewListing/"+item._id, {state:item})
    }
    return (
        <div className="listingItem materialWhite" onClick={gotoListing}>
            <img className="Thumbnail noPointer" src={item.image[0].path}></img>
            <h3 className="breakit noPointer">{item.title}</h3>
            <h3 className="breakit noPointer">PHP {item.price}</h3>
        </div>
    );
}

export default ListingItem