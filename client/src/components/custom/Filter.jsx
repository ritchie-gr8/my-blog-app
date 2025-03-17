import React, { useState } from "react";

const Filter = ({ style }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const articleTypes = ["Highlight", "Cat", "Inspiration", "General"];

  return (
    <div className={`relative flex items-center gap-2 ${style}`}>
      {articleTypes.map((article, index) => (
        <button
          key={index}
          className={`relative px-5 py-3 z-10 font-medium text-sm ${
            activeIndex === index ? "text-brown-500 bg-brown-300 rounded-[8px]" : "text-brown-400"
          }`}
          onClick={() => {
            setActiveIndex(index);
          }}
        >
          {article}
        </button>
      ))}
    </div>
  );
};

export default Filter;
