import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import Button from "../global/Button";
import { Button as DialogButton } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createComment } from "@/api/posts";
import { useUser } from "@/hooks/useUser";
import { toast } from "./Toast";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFormatedDateTime } from "@/lib/utils";
import LoginDialog from "./LoginDialog";

const Comment = ({ comment }) => {
  return (
    <div className="border-b border-b-brown-300 py-6">
      <div className="flex items-center gap-3">
        <Avatar size={44}>
          <AvatarImage src={comment?.user?.profile_picture} />
          <AvatarFallback className="bg-brown-400 text-white">
            {comment.user?.username?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-h4 text-brown-500 font-semibold">
            {comment.user.username}
          </h4>
          <p className="text-b3 text-brown-400 font-medium">
            {getFormatedDateTime(comment.created_at)}
          </p>
        </div>
      </div>

      <p className="text-b1 text-brown-400 font-medium mt-4">
        {comment.content}
      </p>
    </div>
  );
};

const PostCommentSection = ({
  comments,
  postId,
  onNewComment,
  onCommentError,
}) => {
  const { user } = useUser();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const formSchema = z.object({
    content: z.string().min(1, {
      message: "Comment cannot be empty",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleTextareaClick = () => {
    if (!user) {
      setIsLoginDialogOpen(true);
    }
  };

  const onSubmit = async (formData) => {
    const optimisticCommentId = "temp-" + dayjs();
    try {
      const optimisticComment = {
        id: optimisticCommentId,
        content: formData.content,
        created_at: dayjs().toISOString(),
        user: {
          username: user.username,
          profile_picture: user.profile_picture,
        },
      };

      onNewComment(optimisticComment);

      const payload = {
        user_id: user.id,
        post_id: postId,
        content: formData.content,
      };
      const res = await createComment(payload);
      console.log(res);
      form.reset();
      toast.success("Comment added");
    } catch (error) {
      onCommentError(optimisticCommentId);
      toast.error("Error", error?.message || "Failed to add comment");
    }
  };

  return (
    <div className="px-4 py-6 bg-brown-100 mb-7 md:ml-36 md:mr-20 md:px-0">
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
      <div className="flex flex-col">
        <p className="text-b1 font-medium text-brown-400">Comment</p>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              if (!user) {
                e.preventDefault();
                setIsLoginDialogOpen(true);
                return;
              }
              form.handleSubmit(onSubmit)(e);
            }}
            className="flex flex-col"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="py-3 px-3 min-h-[102px] mt-1 mb-3 bg-white placeholder:text-brown-400 placeholder:font-medium placeholder:text-b1"
                      placeholder="What are your thoughts?"
                      onClick={handleTextareaClick}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-fit md:self-end"
              variant={"secondary"}
              disabled={!user}
            >
              Send
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-5" id="comments">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default PostCommentSection;
