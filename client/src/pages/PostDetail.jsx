import React, { useEffect, useState } from "react";
import articleImg from "../assets/article-placeholder.jpg";
import Button from "../components/global/Button";
import AuthorProfileCard from "../components/custom/AuthorProfileCard";
import PostCommentSection from "../components/custom/PostCommentSection";
import PostShareMenu from "../components/custom/PostShareMenu";
import { useParams } from "react-router-dom";
import { getPostById } from "@/api/posts";
import { toast } from "@/components/custom/Toast";

const PostContent = ({ content, introduction }) => {
  return (
    <div className="mb-10">
      <h4 className="font-semibold text-h4 text-brown-600 mb-6">
        {introduction}
      </h4>
      <p className="text-b1 font-medium text-brown-500">{content}</p>
    </div>
  );
};

const PostDetail = () => {
  const [post, setPost] = useState();
  const { id } = useParams();

  const handleNewComment = (newComment) => {
    setPost((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
    }));
  };

  const handleCommentError = (id) => {
    const newComment = post.comments.filter((comment) => comment.id !== id);

    setPost((prev) => ({
      ...prev,
      comments: newComment,
    }));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: postData } = await getPostById(id);
        if (postData) {
          setPost(postData);
        }
      } catch (error) {
        toast.error("Error fetching post", error?.message || "Failed to fetch post");
      }
    };

    fetchPost();
  }, [id]);

  return (
    <article>
      {post && (
        <>
          {/* Image */}
          <div className="w-full md:px-36 md:pt-16">
            <img
              src={articleImg}
              alt="article image"
              className="w-full h-[184px] sm:h-auto max-h-[587px]  md:rounded-xl object-cover max-w-full"
            />
          </div>

          {/* Content */}
          <section className="md:grid md:grid-cols-4 md:mr-36">
            <div className="md:col-span-3">
              <div className="mx-4 mb-10 md:ml-36 md:mr-20 md:mt-12">
                <div className="flex items-center gap-4 mt-6 mb-4">
                  <Button
                    style="px-3 py-1 w-fit font-medium text-b2"
                    variant={"article-genre"}
                  >
                    {post?.category}
                  </Button>

                  <p className="text-b1 font-medium text-brown-400">
                    {new Date(post?.created_at).toLocaleString()}
                  </p>
                </div>

                <h3 className="text-h3 font-semibold text-brown-600">
                  {post?.title}
                </h3>

                <div className="mt-6 mb-9 text-b1 font-medium text-brown-500">
                  <p>{post?.introduction}</p>
                </div>

                <PostContent
                  introduction={post?.description}
                  content={post?.content}
                />

                {post?.author && (
                  <AuthorProfileCard
                    className="md:hidden"
                    user={{
                      name: post.author.name,
                      bio: post.author.bio,
                    }}
                  />
                )}
              </div>

              <PostShareMenu
                likes={post?.likes_count}
                postId={post.id}
                userHasLiked={post?.user_has_liked}
              />

              {post?.comments && post?.comments.length > 0 && (
                <PostCommentSection
                  comments={post?.comments}
                  postId={post?.id}
                  onNewComment={handleNewComment}
                  onCommentError={handleCommentError}
                />
              )}
            </div>
            {post?.author && (
              <div className="hidden md:block md:relative w-fit justify-self-end">
                <AuthorProfileCard
                  className="my-12 sticky top-12 max-w-[305px] right-0"
                  isSticky={true}
                  user={{
                    name: post.author.name,
                    bio: post.author.bio,
                  }}
                />
              </div>
            )}
          </section>
        </>
      )}
    </article>
  );
};

export default PostDetail;
