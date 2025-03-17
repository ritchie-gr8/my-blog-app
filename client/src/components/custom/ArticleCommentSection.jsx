import React from "react";
import { Textarea } from "../ui/textarea";
import Button from "../global/Button";
import Avatar from "../global/Avatar";

const Comment = () => {
  return (
    <div className="border-b border-b-brown-300 py-6">
      <div className="flex items-center gap-3">
        <Avatar size={44} />
        <div>
          <h4 className="text-h4 text-brown-500 font-semibold">Jacob Lash</h4>
          <p className="text-b3 text-brown-400 font-medium">
            12 September 2024 at 18:30
          </p>
        </div>
      </div>

      <p className="text-b1 text-brown-400 font-medium mt-4">
        I loved this article! It really explains why my cat is so independent
        yet loving. The purring section was super interesting.
      </p>
    </div>
  );
};

const ArticleCommentSection = () => {
  return (
    <div className="px-4 py-6 bg-brown-100 mb-7 md:ml-36 md:mr-20 md:px-0">
      <div className="flex flex-col">
        <p className="text-b1 font-medium text-brown-400">Comment</p>
        <Textarea
          className="py-3 px-3 min-h-[102px] mt-1 mb-3 bg-white placeholder:text-brown-400 placeholder:font-medium placeholder:text-b1"
          placeholder="What are your thoughts?"
        />
        <Button className="w-fit md:self-end" variant={"secondary"}>Send</Button>
      </div>

      <div className="mt-5">
        {[1, 2, 3].map((_, idx) => (
          <Comment key={idx} />
        ))}
      </div>
    </div>
  );
};

export default ArticleCommentSection;
