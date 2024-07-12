import axios from "axios";
import { useState, useReducer, Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { initialState, reviewsReducer } from "../reducers/reviewsReducer.js";
import MyContext from "../MyContext.js";
import DeleteReview from "../components/Review/DeleteReview.jsx";
import styles from "../components/Review/reviews.module.css";

const EditReview = () => {
  const { user, current, reload, setReload } = useContext(MyContext);
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(current.rating);
  const [comment, setComment] = useState(current.comment);
  const [imageFile, setImageFile] = useState();
  const [preview, setPreview] = useState(
    current.imageUrl.path || "img/addImg.png"
  );
  const navigate = useNavigate();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // allows the user to close the modal window by clicking outside of it
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // sets a preview of the uploaded image
  const handlePreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // handles the PATCH request to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("rating", rating);
    data.append("comment", comment);
    data.append("review-image", imageFile);

    const editReview = await axios.patch(
      `http://localhost:4000/api/v1/reviews/${current.reviewID}`,
      data,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    dispatch({ type: "UPDATE_REVIEW", payload: editReview.data.data });
    setReload(!reload);
    navigate(-1);
  };

  const stars = [0, 0, 0, 0, 0]
    .map((_, i) => {
      if (i + 1 == rating) {
        return (
          <Fragment key={i}>
            <input
              key={`star${i + 1}`}
              type="radio"
              id={`star${i + 1}`}
              name="rating"
              value={i + 1}
              defaultChecked
            />
            <label htmlFor={`star${i + 1}`} key={`label${i + 1}`}>
              &#9733;
            </label>
          </Fragment>
        );
      } else {
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
      }
    })
    .reverse();

  return (
    <div onClick={handleOverlayClick}>
      <form className={styles.feedbackForm} onSubmit={(e) => handleSubmit(e)}>
        <h2>Edit your review</h2>

        <h4>Rate the seller</h4>
        <div
          className={styles.rating}
          onChange={(e) => {
            setRating(e.target.value);
          }}
          defaultValue={rating}
        >
          {stars}
        </div>
        <label>Edit your feedback</label>
        <div className={styles.comment}>
          <textarea
            id="comment"
            defaultValue={comment}
            onChange={(e) => setComment(e.target.value)}
          />
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

        <div className={styles.buttonDiv}>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className={styles.deleteBtn}
          >
            Delete
          </button>
          <DeleteReview show={showModal} onClose={handleCloseModal} />
          <button type="submit" className={styles.submitBtn}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReview;
