import axios from "axios";
import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { initialState, reviewsReducer } from "../../reducers/reviewsReducer.js";
import getUsers from "../../hooks/getUsers.js";
import ReviewCard from "./ReviewCard.jsx";

const ReviewsByUser = () => {
  const user = useParams();
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  getUsers();

  useEffect(() => {
    const fetchReviewsByUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/reviews/by-user/${user.id}`
        );

        localStorage.setItem("reviews", JSON.stringify(response.data.data));

        dispatch({ type: "LIST_REVIEW", payload: response.data.data });
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviewsByUser();
  }, [state.reviews.length]);

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
    return <ReviewCard key={review._id} reviewData={reviewData} method={2} />;
  });

  return <div>{reviewsList}</div>;
};

export default ReviewsByUser;
