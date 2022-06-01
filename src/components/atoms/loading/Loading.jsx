import React from "react";

const Loading = () => {
  return (
    <div class="d-flex justify-content-center ">
      <div
        class="spinner-grow text-info"
        role="status"
        style={{ width: "5rem", height: "5rem" }}
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
};
export default Loading;
