import React, { useState } from "react";
import Button from "../global/Button";
import { Check, Copy } from "lucide-react";
import LikeButton from "./LikeButton";
import { toast } from "./Toast";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";

const PostShareMenu = ({ likes = 0, postId, userHasLiked = false }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    toast.success("Link copied to clipboard");

    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      className="bg-brown-200 p-4 flex flex-col gap-6 

    md:ml-36 md:mr-20 md:rounded-2xl md:flex-row md:justify-between md:px-6"
    >
      <LikeButton
        postId={postId}
        initialLikeCount={likes}
        userHasLiked={userHasLiked}
      />

      <div className="flex gap-2 flex-row sm:flex-col lg:flex-row">
        <Button
          className="flex sm:hidden lg:flex items-center gap-1.5 w-fit"
          handleOnClick={() => copyLink()}
        >
          {copied ? <Check /> : <Copy />}
          Copy link
        </Button>
        <Button
          className="hidden sm:flex lg:hidden items-center gap-1.5 w-fit"
          handleOnClick={() => copyLink()}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
        <div className="flex gap-2 md:items-center md:justify-center">
          <FacebookShareButton url={window.location.href}>
            <FacebookIcon size={48} round />
          </FacebookShareButton>
          <LinkedinShareButton url={window.location.href}>
            <LinkedinIcon size={48} round />
          </LinkedinShareButton>
          <TwitterShareButton url={window.location.href}>
            <XIcon size={48} round />
          </TwitterShareButton>
        </div>
      </div>
    </div>
  );
};

export default PostShareMenu;
