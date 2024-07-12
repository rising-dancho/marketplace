import { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MyContext from "../MyContext";
const AddListing = () => {
  const { user } = useContext(MyContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  let [editListingID, setEditListingID] = useState("");
  let [listingName, setListingName] = useState("");
  let [listingDescription, setListingDescription] = useState("");
  let [listingPrice, setListingPrice] = useState(0);
  let defaultImgURL = "/img/addImg.png";
  let [displayImg1, setDisplayImg1] = useState(defaultImgURL);
  let [displayImg2, setDisplayImg2] = useState(defaultImgURL);
  let [displayImg3, setDisplayImg3] = useState(defaultImgURL);
  let [displayImg4, setDisplayImg4] = useState(defaultImgURL);
  let [selectedImg1, setSelectedImg1] = useState(null);
  let [selectedImg2, setSelectedImg2] = useState(null);
  let [selectedImg3, setSelectedImg3] = useState(null);
  let [selectedImg4, setSelectedImg4] = useState(null);
  let [imgErr, setImgErr] = useState(false);
  let [catErr, setCatErr] = useState(false);
  let [selectedImages, setSelectedImages] = useState([]);
  let [editMode, setEditMode] = useState(false);
  const selectOptions = [
    { value: "Food", label: "Food" },
    { value: "Cars and car parts", label: "Cars and car parts" },
    { value: "Computers", label: "Computers" },
    { value: "Gadgets", label: "Gadgets" },
    { value: "Home Improvement", label: "Home Improvement" },
    { value: "Appliances", label: "Appliances" },
  ];
  let [listingCategory, setListingCategory] = useState(selectOptions[0]);
  const firstRun = useRef(true);
  function getImgPath1(e) {
    if (e.target.files && e.target.files[0]) {
      setDisplayImg1(URL.createObjectURL(e.target.files[0]));
      setSelectedImg1(e.target.files[0]);
      setImgErr(false);
    }
  }
  function getImgPath2(e) {
    if (e.target.files && e.target.files[0]) {
      setDisplayImg2(URL.createObjectURL(e.target.files[0]));
      setSelectedImg2(e.target.files[0]);
      setImgErr(false);
    }
  }
  function getImgPath3(e) {
    if (e.target.files && e.target.files[0]) {
      setDisplayImg3(URL.createObjectURL(e.target.files[0]));
      setSelectedImg3(e.target.files[0]);
      setImgErr(false);
    }
  }
  function getImgPath4(e) {
    if (e.target.files && e.target.files[0]) {
      setDisplayImg4(URL.createObjectURL(e.target.files[0]));
      setSelectedImg4(e.target.files[0]);
      setImgErr(false);
    }
  }
  function getImgForEdit(image, i) {
    axios({
      url: image.path, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      let ImgtoSet = new File([response], response);
      // setSelectedImg(response.data);
      // setImgRemoveButtonClass("Active");
      switch (i) {
        case 0:
          setSelectedImg1(response.data);
          setDisplayImg1(image.path);
          break;
        case 1:
          setSelectedImg2(response.data);
          setDisplayImg2(image.path);
          break;
        case 2:
          setSelectedImg3(response.data);
          setDisplayImg3(image.path);
          break;
        case 3:
          setSelectedImg4(response.data);
          setDisplayImg4(image.path);
          break;
      }
    });
  }
  async function registerNewListing(data) {
    await axios
      .post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/addListing`,
        data,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((result) => {
        navigate("../viewListing/" + result.data.data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function editListing(data) {
    await axios
      .put(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/editListing/` +
          editListingID,
        data,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((result) => {
        navigate("../viewListing/" + result.data.data._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    let tempImgArray = [selectedImg1, selectedImg2, selectedImg3, selectedImg4];
    let filteredExistImg = tempImgArray.filter((img) => img != null);
    if (!filteredExistImg.length || !listingCategory) {
      if (!filteredExistImg.length) {
        setImgErr(true);
      }
      if (!listingCategory) {
        setCatErr(true);
      }
    } else {
      data.append("userID", user.id);
      data.append("title", listingName);
      data.append("description", listingDescription);
      data.append("price", listingPrice);
      data.append("category", listingCategory.value);
      data.append("isSold", false);
      filteredExistImg.forEach((image) => {
        data.append("listing-img", image);
      });
      if (!editMode) {
        registerNewListing(data);
      } else {
        editListing(data);
      }
    }
  }
  function handleXImage(i) {
    switch (i) {
      case 0:
        setSelectedImg1(null);
        setDisplayImg1(defaultImgURL);
        break;
      case 1:
        setSelectedImg2(null);
        setDisplayImg2(defaultImgURL);
        break;
      case 2:
        setSelectedImg3(null);
        setDisplayImg3(defaultImgURL);
        break;
      case 3:
        setSelectedImg4(null);
        setDisplayImg4(defaultImgURL);
        break;
    }
  }
  useEffect(() => {
    if (location.state) {
      const selectedListing = location.state;
      setEditListingID(id);
      setListingName(selectedListing.title);
      setListingDescription(selectedListing.description);
      setListingPrice(selectedListing.price);
      setListingCategory(
        selectOptions[
          selectOptions.findIndex(
            (option) => option.value == selectedListing.category
          )
        ]
      );
      setEditMode(true);
      selectedListing.image.forEach((image, i) => {
        getImgForEdit(image, i);
      });
    }
  }, []);
  return (
    <form
      className="listingWindow materialWhite addListingDiv"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="imageInputContent">
        <input
          type="file"
          id="imgUpload1"
          onChange={(e) => {
            getImgPath1(e);
          }}
          className="imgUpload"
        ></input>
        <label htmlFor="imgUpload1">
          <div className="imgUploadDisplay materialWhite noPointers">
            <img src={displayImg1} className="uploadThumb" />
            {selectedImg1 && (
              <button
                className="imageRemoveButton havePointers"
                onClick={() => {
                  handleXImage(0);
                }}
              >
                X
              </button>
            )}
          </div>
        </label>
        <input
          type="file"
          id="imgUpload2"
          onChange={(e) => {
            getImgPath2(e);
          }}
          className="imgUpload"
        ></input>
        <label htmlFor="imgUpload2">
          <div className="imgUploadDisplay materialWhite noPointers">
            <img src={displayImg2} className="uploadThumb" />
            {selectedImg2 && (
              <button
                className="imageRemoveButton havePointers"
                onClick={() => {
                  handleXImage(1);
                }}
              >
                X
              </button>
            )}
          </div>
        </label>
        <input
          type="file"
          id="imgUpload3"
          onChange={(e) => {
            getImgPath3(e);
          }}
          className="imgUpload"
        ></input>
        <label htmlFor="imgUpload3">
          <div className="imgUploadDisplay materialWhite noPointers">
            <img src={displayImg3} className="uploadThumb" />
            {selectedImg3 && (
              <button
                className="imageRemoveButton havePointers"
                onClick={() => {
                  handleXImage(2);
                }}
              >
                X
              </button>
            )}
          </div>
        </label>
        <input
          type="file"
          id="imgUpload4"
          onChange={(e) => {
            getImgPath4(e);
          }}
          className="imgUpload"
        ></input>
        <label htmlFor="imgUpload4">
          <div className="imgUploadDisplay materialWhite noPointers">
            <img src={displayImg4} className="uploadThumb" />
            {selectedImg4 && (
              <button
                className="imageRemoveButton havePointers"
                onClick={() => {
                  handleXImage(3);
                }}
              >
                X
              </button>
            )}
          </div>
        </label>
      </div>
      {imgErr && <h3 className="error">Select an Image</h3>}
      <h2>Listing Name</h2>
      <input
        type="text"
        onChange={(e) => {
          setListingName(e.target.value);
        }}
        value={listingName}
        required
      ></input>
      <h3>Description</h3>
      <textarea
        onChange={(e) => {
          setListingDescription(e.target.value);
        }}
        value={listingDescription}
        className="listingDesc"
        required
      ></textarea>
      <h3>Price</h3>
      <input
        type="number"
        onChange={(e) => {
          setListingPrice(e.target.value);
        }}
        value={listingPrice}
        required
      ></input>
      <h3>Category</h3>
      <div className="categorySelect">
        <Select
          value={listingCategory}
          options={selectOptions}
          onChange={(choice) => {
            setListingCategory(choice);
            setCatErr(false);
          }}
          isSearchable={false}
        />
      </div>
      {catErr && <h3 className="error">Select a category</h3>}
      <button className="addButton" type="submit">
        {editMode ? "Edit Listing" : "Add a listing!"}
      </button>
    </form>
  );
};

export default AddListing;
