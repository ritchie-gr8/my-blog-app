import React from "react";
import Button from "../global/Button";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ImageUploader = ({ imageUrl, onImageChange }) => {
  const { user } = useUser();

  const handleFileChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      onImageChange({ url: imageUrl, file }); // Pass both URL and file
    }
  };

  return (
    <div
      className="flex flex-col items-center w-full py-6
    justify-center gap-6 border-b border-b-brown-300"
    >
      <Avatar className="size-[100px]">
        <AvatarImage src={imageUrl || user.profile_picture} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
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
