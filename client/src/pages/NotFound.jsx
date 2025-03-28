import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center mt-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <span
            className="px-6 py-3 underline text-lg rounded-lg"
            href="/"
          >
            Go to Homepage
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
