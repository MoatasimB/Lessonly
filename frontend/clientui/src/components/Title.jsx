import React from "react";

const Title = ({titleText, setTitleText}) => {
  return (
    <input
      className="w-full border-4 border-cyan-500 rounded-md p-2 mb-2 outline-none px-2"
      value={titleText}
      onChange={(e) => setTitleText(e.target.value)}
      placeholder="Name your plan..."
    />
  );
};

export default Title;
