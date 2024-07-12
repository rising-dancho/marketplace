import { useState } from "react";
import ReviewsByUser from "./ReviewsByUser";
import ReviewsOfUserByListing from "./ReviewsOfUserByListing";

function ReviewTabs() {
  const [toggleState, setToggleState] = useState(1); // Initialize to a default value

  function handleTabToggle(index) {
    setToggleState(index);
  }

  return (
    <div className="review-tabs">
      <div className="header-tabs">
        <div
          onClick={() => handleTabToggle(1)}
          className={toggleState === 1 ? "tab active" : "tab"}
        >
          By Others
        </div>
        <div
          onClick={() => handleTabToggle(2)}
          className={toggleState === 2 ? "tab active" : "tab"}
        >
          By User
        </div>
      </div>

      <div className="content-tabs">
        <div className={toggleState === 1 ? "content active" : "content"}>
          <ReviewsOfUserByListing />
        </div>

        <div className={toggleState === 2 ? "content active" : "content"}>
          <ReviewsByUser />
        </div>
      </div>
    </div>
  );
}

export default ReviewTabs;

// references for creating tabs:
// logic: https://www.youtube.com/watch?v=WkREeDy2WQ4
// design: https://www.youtube.com/watch?v=6aABomFC99o
// bugfix: https://stackoverflow.com/questions/21979185/disable-text-cursor-within-a-div
