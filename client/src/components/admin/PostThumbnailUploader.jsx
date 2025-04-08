import React from "react";
import { Button } from "../ui/button";
import { Image } from "lucide-react";

const PostThumbnailUploader = ({ imageUrl, onImageChange, isLoading }) => {
  const handleFileChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const imageUrl = file ? URL.createObjectURL(file) : null;
      onImageChange({ url: imageUrl, file }); // Pass both URL and file
    }
  };

  return (
    <div className="flex items-end gap-4">
      <div className="border border-gray-200 rounded-md bg-gray-50 h-64 w-[460px] flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image size={24} className="text-gray-400" />
        )}
      </div>
      <div className="relative">
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="absolute inset-0 opacity-0 z-10 cursor-pointer"
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outline"
            className="rounded-md px-4 py-2 text-sm border-brown-300 text-brown-600" 
            disabled={isLoading}
          >
            Upload thumbnail image
          </Button>
        </label>
      </div>
    </div>
  );
};

export default PostThumbnailUploader;
