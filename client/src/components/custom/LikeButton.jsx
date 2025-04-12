import React, { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import Button from "../global/Button";
import { likePost, unlikePost } from "@/api/posts";
import { toast } from "@/components/custom/Toast";
import { useUser } from "@/hooks/useUser";
import LoginDialog from "./LoginDialog";

const LikeButton = ({ postId, initialLikeCount, userHasLiked }) => {
  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { user } = useUser();

  const handleLikeToggle = async () => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }

    if (isLoading) return;

    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setIsLoading(true);

    try {
      if (newIsLiked) {
        await likePost(postId);
      } else {
        await unlikePost(postId);
      }
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
      toast.error(
        "Failed to update like status",
        error?.message || "Failed to update like status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
      <Button
        className={`w-full flex items-center justify-center gap-2.5 text-b1 font-medium md:w-fit
        ${isLiked ? "text-red-500" : "text-brown-600"} 
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        handleOnClick={handleLikeToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        )}
        {likeCount}
      </Button>
    </>
  );
};

export default LikeButton;
