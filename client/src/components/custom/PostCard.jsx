import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Button from "../global/Button";

const PostCard = ({
  image,
  category,
  title,
  description,
  author_name,
  author_profile_picture,
  date,
}) => {
  return (
    <div className="p-4 flex flex-col justify-between h-full">
      <div>
        <img
          src={image}
          alt={title}
          className="w-full h-[212px] xl:h-[240px] 2xl:h-[360px] object-cover"
        />
        <Button
          className="px-3 py-1 w-fit mt-4 mb-2 font-medium text-b2"
          variant={"article-genre"}
        >
          {category}
        </Button>

        <h4 className="text-h4 font-semibold text-brown-600 line-clamp-2">{title}</h4>

        <p className="text-b2 font-medium text-brown-400 mt-2 mb-4 line-clamp-3">
          {description}
        </p>
      </div>

      <div className="flex items-center">
        <div className="flex items-center border-r border-r-brown-300 w-fit">
          <Avatar className="size-6">
            <AvatarImage src={author_profile_picture} />
            <AvatarFallback className="bg-brown-400 text-sm text-brown-100">
              {author_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 mr-4 text-b2 text-brown-500 font-medium">
            {author_name}
          </span>
        </div>
        <span className="ml-4 font-medium text-b2 text-brown-400">{date}</span>
      </div>
    </div>
  );
};

export default PostCard;
