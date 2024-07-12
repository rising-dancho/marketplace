import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import searchTermContext from "../context/searchTermContext";
import CreateReviewModalBtn from "../components/Review/CreateReviewModalBtn";
import ReviewsByListing from "../components/Review/ReviewsByListing";
import MyContext from "../MyContext";

const ViewListing = () => {
  const location = useLocation();
  const { id } = useParams();
  const { user } = useContext(MyContext);
  const { searchTerm, setSearchTerm } = useContext(searchTermContext);
  const navigate = useNavigate();
  const [item, setItem] = useState({
    title: "",
    image: [{ path: "" }],
    category: "",
    price: 0,
    description: "",
  });
  const [itemName, setItemName] = useState("");
  const [isMyItem, setIsMyItem] = useState(false);
  const [itemSold, setItemSold] = useState(false);
  const [itemDeleted, setItemDeleted] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [posterName, setPosterName] = useState("");
  const [posterNumber, setPosterNumber] = useState("");
  const [posterID, setPosterID] = useState("");
  const [necessaryChatInfo, setNecessaryChatInfo] = useState({});
  let firstRun = useRef(true);
  async function getListingifNot() {
    await axios
      .get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/viewListing/` +
          id
      )
      .then((result) => {
        setItem(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function markSold() {
    await axios
      .put(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/markSold/` + id,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((result) => {
        setItemSold(true);
        alert("Item marked as sold");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function gotoEdit() {
    navigate("../editListing/" + item._id, { state: item });
  }
  async function deleteItem() {
    await axios
      .put(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/deleteListing/` +
          id,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(() => {
        setItemDeleted(true);
        alert("Item has been deleted");
        if (searchTerm) {
          setSearchTerm("");
        } else {
          navigate("/");
        }
      });
  }
  useEffect(() => {
    if (!location.state) {
      getListingifNot();
    } else {
      setItem(location.state);
    }
  }, []);
  useEffect(() => {
    if (!firstRun.current) {
      navigate("/");
    }
  }, [searchTerm]);
  useEffect(() => {
    if (!firstRun.current) {
      if (user) {
        if (item.userID._id == user.id) {
          setIsMyItem(true);
        } else {
          setIsMyItem(false);
        }
      }
      if (item) {
        if (item.isSold) {
          setItemSold(true);
          setItemName(item.title + "(Sold)");
        } else {
          setItemSold(false);
          setItemName(item.title);
        }
        if (item.deleted) {
          setItemDeleted(true);
          setItemName(item.title + "(Unavailable)");
        } else {
          setItemDeleted(false);
        }
      }
      if (item.userID.image) {
        setUserImage(item.userID.image[0].path);
      }
      setPosterName(item.userID.username);
      setPosterNumber(item.userID.phone);
      setPosterID(item.userID._id);
      setNecessaryChatInfo({
        _id: item.userID._id,
        username: item.userID.username,
        image: item.userID.image,
      });
    } else {
      firstRun.current = false;
    }
  }, [item]);
  useEffect(() => {
    if (itemSold) {
      setItemSold(true);
      setItemName(item.title + "(Sold)");
    } else {
      setItemSold(false);
      setItemName(item.title);
    }
  }, [itemSold]);
  return (
    <div className="listingWindow materialWhite addListingDiv">
      <div className="buttonNav">
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          ←Back
        </button>
        {isMyItem && <button onClick={markSold}>Mark as sold</button>}
        {isMyItem && <button onClick={gotoEdit}>Edit Listing</button>}
        {isMyItem && (
          <button className="deleteButton" onClick={deleteItem}>
            Delete Listing
          </button>
        )}
        {!isMyItem && <CreateReviewModalBtn listingID={id} />}
      </div>
      <h1>{itemName}</h1>
      <div className="imageInputContent">
        {item.image.map((image, i) => (
          <div key={i} className="imgUploadDisplay materialWhite noPointers">
            <img src={image.path} className="uploadThumb" />
          </div>
        ))}
      </div>
      <div className="infoDiv">
        <div className="listingInfo">
          <div className="categoryDiv">{item.category}</div>
          <h3>PHP {item.price}</h3>
          <h3>{item.description}</h3>
        </div>
        <div className="UserInfo">
          <h2>Item posted by</h2>
          <div
            className="listingClickable"
            onClick={() => {
              navigate("../profile/" + posterID);
            }}
          >
            <img src={userImage} className="userListingThumb" />
            <h3>{posterName}</h3>
            <h3>{posterNumber}</h3>
          </div>
          {!isMyItem && (
            <button
              onClick={() => {
                navigate("../messages/" + posterID, {
                  state: necessaryChatInfo,
                });
              }}
            >
              Send this user a message
            </button>
          )}
        </div>
      </div>
      <div className="reviews">
        <ReviewsByListing listingID={id} />
      </div>
    </div>
  );
};
export default ViewListing;
