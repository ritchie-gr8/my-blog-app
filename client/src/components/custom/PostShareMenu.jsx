import React, { useState } from "react";
import Button from "../global/Button";
import { Check, Copy } from "lucide-react";
import facebookIcon from "../../assets/facebook-logo.svg";
import linkedIcon from "../../assets/linkedin-logo.svg";
import xTwitterIcon from "../../assets/x-twitter-logo.svg";
import LikeButton from "./LikeButton";

const PostShareMenu = ({ likes = 0, postId, userHasLiked = false }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
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
          <a>
            <img src={facebookIcon} alt="facebook icon" />
          </a>
          <a>
            <img src={linkedIcon} alt="linkedin icon" />
          </a>
          <a>
            <img src={xTwitterIcon} alt="twitter icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostShareMenu;
