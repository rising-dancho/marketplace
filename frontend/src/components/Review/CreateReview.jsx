import axios from "axios";
import { useState, useReducer, useContext, Fragment } from "react";
import { initialState, reviewsReducer } from "../../reducers/reviewsReducer.js";
import MyContext from "../../MyContext.js";
import styles from "./reviews.module.css";

const CreateReview = ({ listingID, show, onClose, error, setError }) => {
  const { user, reload, setReload } = useContext(MyContext);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("/img/addImg.png");
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  const handlePreview = (e) => {
    setImageFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleCloseModal = () => {
    setRating("");
    setComment("");
    setImageFile(null);
    setError(false);
    onClose();
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setRating("");
      handleCloseModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isExists = state.reviews.find((item) => {
      return item.listingID._id === listingID && item.userID._id === user.id;
    });

    try {
      if (!rating) {
        setError("Please at least enter a star rating.");
        throw new Error("Please at least enter a star rating.");
      }

      const data = new FormData();
      data.append("userID", user.id);
      data.append("listingID", listingID);
      data.append("rating", rating);
      data.append("comment", comment);
      data.append("review-image", imageFile);

      const newReview = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/reviews/`,
        data,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setReload(!reload);
      handleCloseModal();

      dispatch({ type: "CREATE_REVIEW", payload: newReview.data.data });
    } catch (error) {
      if (error.response.status === 409) {
        setError("You have already made a review for this listing.");
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  };

  // Modal window controller
  if (!show) {
    return null;
  }

  const stars = [0, 0, 0, 0, 0]
    .map((_, i) => {
      return (
        <Fragment key={i}>
          <input
            key={`star${i + 1}`}
            type="radio"
            id={`star${i + 1}`}
            name="rating"
            value={i + 1}
          />
          <label htmlFor={`star${i + 1}`} key={`label${i + 1}`}>
            &#9733;
          </label>
        </Fragment>
      );
    })
    .reverse();

  let errorMsg = "";
  if (error === 1) {
    errorMsg = "You have already made a review for this listing.";
  } else if (error === 2) {
    errorMsg = "Please at least enter a star rating.";
  }

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <form className={styles.feedbackForm} onSubmit={(e) => handleSubmit(e)}>
        <h2>How was your experience?</h2>

        <h4>Rate the seller</h4>
        <div
          className={styles.rating}
          onChange={(e) => {
            setRating(e.target.value);
          }}
        >
          {stars}
        </div>
        <label>Any feedback?</label>
        <div className={styles.comment}>
          <textarea id="comment" onChange={(e) => setComment(e.target.value)} />
        </div>
        <input
          type="file"
          id="fileUpload"
          className={styles.fileInput}
          onChange={(e) => handlePreview(e)}
        />
        <label htmlFor="fileUpload" className={styles.fileUpload}>
          <img src={preview} alt="preview" className={styles.previewIMG} />
        </label>

        <div className={error ? styles.error : styles.noError}>{error}</div>
        <div className={styles.buttonDiv}>
          <button className={styles.submitBtn} onClick={handleCloseModal}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
