import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { initialState, reviewsReducer } from "../../reducers/reviewsReducer.js";
import getUsers from "../../hooks/getUsers.js";
import MyContext from "../../MyContext.js";
import ReviewCard from "./ReviewCard.jsx";

const ReviewsByListing = ({ listingID }) => {
  const { reload } = useContext(MyContext);
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  getUsers();

  useEffect(() => {
    const fetchReviewsByListing = async () => {
      if (listingID) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/reviews//by-listing/${listingID}`
          );

          localStorage.setItem("reviews", JSON.stringify(response.data.data));

          dispatch({ type: "LIST_REVIEW", payload: response.data.data });
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };
    fetchReviewsByListing();
  }, [state.reviews.length, reload]);

  const reviewsList = state.reviews.map((review) => {
    const reviewData = {
      reviewID: review._id,
      userID: review.userID,
      listing: review.listingID,
      rating: review.rating,
      comment: review.comment,
      updatedAt: review.updatedAt,
      imageUrl: review.image,
    };
    return (
      <ReviewCard key={review._id} reviewData={reviewData} inListing={true} />
    );
  });

  return <div>{reviewsList}</div>;
};

export default ReviewsByListing;
