import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import MyContext from "../../MyContext";
import no_avatar from "../../images/no-avatar.svg";
import styles from "./reviews.module.css";

const ReviewCard = ({ reviewData, inListing }) => {
  const { user, setCurrent, reload, setReload } = useContext(MyContext);
  const { userID, listing, rating, comment, updatedAt, imageUrl } = reviewData;

  // finds details of userID for when Query population fails to work
  const parsed = JSON.parse(localStorage.getItem("usernames")) || [];
  const userObj = parsed.find((item) => item.userID === userID);
  const username = userObj ? userObj.username : userID.username;
  const id = userObj ? userObj.userID : userID._id;
  let userIDIMG = "";
  if (userID.image && userID.image[0]) userIDIMG = userID.image[0].path;
  const profileIMG = userObj ? userObj.profileIMG : userIDIMG;

  // checks if the review belongs to the active user
  const isYours = id === user.id;

  const handleOnClick = () => {
    setCurrent(reviewData);
  };

  // How many days ago the review was posted.
  const daysAgo = (date) => {
    const parsedDate = new Date(date);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const ms = currentDate - parsedDate;
    const oneHour = 1000 * 60 * 60;
    const oneDay = 1000 * 60 * 60 * 24;
    const days = Math.floor(ms / oneDay);
    const months = Math.floor(days / 30);

    if (ms < 60000) {
      return "Less than a minute ago";
    } else if (ms < oneHour) {
      const minutes = Math.floor(ms / 60000);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (ms < oneDay) {
      const hours = Math.floor(ms / oneHour);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else if (months >= 12) {
      const years = Math.floor(days / 365);
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  };

  const listingIMG = listing.image[0].path;

  const stars = [0, 0, 0, 0, 0].map((_, i) => {
    if (i <= rating - 1)
      return <Fragment key={`star${i + 1}`}>&#9733;</Fragment>;
  });

  return (
    <div className={styles.cardInListing}>
      <div className={styles.flexGrow}>
        <div className={styles.cardHeader}>
          <div className={styles.flexCenter}>
            <img
              src={profileIMG || no_avatar}
              alt="profile image"
              className={styles.profileIMG}
            />
            {username}
            <small>&emsp;{daysAgo(updatedAt)}</small>
          </div>
          {isYours && (
            <>
              <Link
                to="/edit-review"
                onClick={handleOnClick}
                className={styles.rightBtn}
              >
                Edit
              </Link>
            </>
          )}
        </div>
        <div>
          <span className={styles.starReview}>{stars}</span>
        </div>

        <div>
          <p>{comment}</p>
        </div>

        <div className={styles.listingMini}>
          {!inListing && (
            <Link
              to={`../viewListing/${listing._id}`}
              onClick={() => setReload(!reload)}
              className={styles.listingPrev}
            >
              <img
                src={listingIMG}
                alt="listingImg"
                className={styles.listingIMG}
              />
              <div>
                <h4>{listing.title}</h4>
                <span>PHP {listing.price}</span>
              </div>
            </Link>
          )}
        </div>
      </div>
      <div>
        {imageUrl.path && (
          <img
            src={imageUrl.path}
            alt="review image"
            className={styles.reviewIMG}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
