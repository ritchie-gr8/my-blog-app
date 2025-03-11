import React from "react";

const SearchBox = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center px-4 py-4 bg-brown-200 sm:rounded-2xl">
      <div class="hidden sm:flex items-center gap-2 w-full font-medium">
        <button className="px-5 py-3 bg-brown-300 rounded-lg text-brown-500">Highlight</button>
        <button className="px-5 py-3 text-brown-400" >Cat</button>
        <button className="px-5 py-3 text-brown-400">Inspiration</button>
        <button className="px-5 py-3 text-brown-400">General</button>
      </div>

      <label
        className="input border border-brown-300 w-full sm:max-w-[360px]"
        style={{
          outline: "none",
          boxShadow: "none",
        }}
      >
        <input
          type="search"
          className="grow placeholder:text-brown-400 placeholder:font-medium"
          placeholder="Search"
        />
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
      </label>

      <p className="font-medium text-brown-400 mt-4 mb-1 sm:hidden">Category</p>

      <select
        defaultValue="Highlight"
        className="select text-brown-400 font-medium w-full sm:hidden"
        style={{
          outline: "none",
          boxShadow: "none",
        }}
      >
        <option disabled={true}>Highlight</option>
        <option>Crimson</option>
        <option>Amber</option>
        <option>Velvet</option>
      </select>
    </div>
  );
};

export default SearchBox;
