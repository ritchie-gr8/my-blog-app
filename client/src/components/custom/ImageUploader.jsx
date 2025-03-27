import React, { useState } from "react";
import Avatar from "../global/Avatar";
import Button from "../global/Button";

const ImageUploader = ({ imageUrl }) => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file ? URL.createObjectURL(file) : null);
    }
  };

  return (
    <div
      className="flex flex-col items-center w-full py-6
    justify-center gap-6 border-b border-b-brown-300"
    >
      {image && <Avatar img={image} size={100} />}
      {!image && <Avatar size={100} />}
      <div className="relative">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload">
          <Button className="w-full">Upload profile picture</Button>
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
