import { useContext, useEffect, useRef, useState } from "react";
import ListingItem from "../components/ListingItem";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import searchTermContext from "../context/searchTermContext";

const ListingScreen = () => {
  const location = useLocation();
  const { searchTerm } = useContext(searchTermContext);
  const [searchResults, setSearchResults] = useState([]);
  const [haveResults, setHaveResults] = useState(false);
  let firstRun = useRef("true");
  let navigate = useNavigate();
  async function getSearchItems() {
    console.log(searchTerm);
    axios
      .get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/search/` +
          searchTerm
      )
      .then((result) => {
        setSearchResults(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function getAllItems() {
    axios
      .get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/listings/viewAllListings/`
      )
      .then((result) => {
        setSearchResults(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    if (searchTerm) {
      getSearchItems();
    } else {
      getAllItems();
    }
  }, []);
  useEffect(() => {
    if (!firstRun.current) {
      if (searchTerm) {
        getSearchItems();
      } else {
        getAllItems();
      }
    } else {
      firstRun.current = false;
    }
  }, [searchTerm]);
  useEffect(() => {
    setHaveResults(Boolean(searchResults.length));
  }, [searchResults]);
  return (
    <div className="listingWindow">
      {haveResults &&
        searchResults.map((listing, index) => (
          <ListingItem key={index} listing={listing} />
        ))}
      {!haveResults && (
        <div className="listingWindow noResult">
          <h2>No results for search term</h2>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};
export default ListingScreen;
