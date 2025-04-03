import React from "react";

const Filter = ({ style, onFilterChange, categories, selectedCategory, setSelectedCategory }) => {

  return (
    <div className={`relative flex items-center gap-2 ${style}`}>
      {categories && categories.map((category) => (
        <button
          key={category.id}
          className={`relative px-5 py-3 z-10 font-medium text-sm cursor-pointer ${
            selectedCategory.id === category.id ? "text-brown-500 bg-brown-300 rounded-[8px]" : "text-brown-400"
          }`}
          onClick={() => {
            setSelectedCategory(category)
            onFilterChange(category.name)
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Filter;
