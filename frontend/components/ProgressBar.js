import React, { useEffect, useRef } from "react";

const ProgressBar = ({ duration }) => {
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (progressBarRef.current) {
      // Set the width to 0 initially to reset any previous transition
      progressBarRef.current.style.width = "0%";

      // Ensure the bar's transition property is set before starting the transition
      progressBarRef.current.style.transition = `width ${duration}s linear`;

      // Apply the width change after a short delay to trigger the transition
      setTimeout(() => {
        progressBarRef.current.style.width = "100%";
      }, 100); // 100ms delay
    }
  }, [duration]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div className="progress-container">
        <div className="progress-bar" ref={progressBarRef}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
