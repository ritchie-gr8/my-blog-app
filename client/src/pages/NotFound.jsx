import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div class="flex justify-center items-center mt-24">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          class="px-6 py-3  underline text-lg rounded-lg  transition duration-300"
          href="/"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;
