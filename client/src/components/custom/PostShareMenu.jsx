import React, { useState } from "react";
import Button from "../global/Button";
import { Check, Copy, Smile } from "lucide-react";
import facebookIcon from "../../assets/facebook-logo.svg";
import linkedIcon from "../../assets/linkedin-logo.svg";
import xTwitterIcon from "../../assets/x-twitter-logo.svg";

const PostShareMenu = () => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="bg-brown-200 p-4 flex flex-col gap-6 md:ml-36 md:mr-20 md:rounded-2xl md:flex-row md:justify-between md:px-6">
      <Button className="w-full flex items-center justify-center gap-2.5 text-b1 font-medium text-brown-600 md:w-fit">
        <Smile size={18} /> 321
      </Button>

      <div className="flex gap-2">
        <Button
          className="flex items-center gap-1.5"
          handleOnClick={() => copyLink()}
        >
          {copied ? <Check /> : <Copy />}
          Copy link
        </Button>
        <div className="flex gap-2">
          <a>
            <img src={facebookIcon} alt="facebook icon" />
          </a>
          <a>
            <img src={linkedIcon} alt="facebook icon" />
          </a>
          <a>
            <img src={xTwitterIcon} alt="facebook icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PostShareMenu;
