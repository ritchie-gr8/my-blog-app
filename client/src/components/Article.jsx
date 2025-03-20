import React, { useEffect, useState } from "react";
import articleImg from "../assets/article-placeholder.jpg";
import Button from "./global/Button";
import AuthorProfileCard from "./custom/AuthorProfileCard";
import ArticleShareMenu from "./custom/ArticleShareMenu";
import ArticleCommentSection from "./custom/ArticleCommentSection";
import { getPostById } from "@/api/posts";
import { getUserById } from "@/api/users";

const ArticleContent = ({ content }) => {
  return (
    <div className="mb-10">
      <h4 className="font-semibold text-h4 text-brown-600 mb-6">
        1. Independent Yet Affectionate
      </h4>
      <p className="text-b1 font-medium text-brown-500">{content}</p>
    </div>
  );
};

const Article = () => {
  const [post, setPost] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchPost = async () => {
      // TODO: change to get url param for post id
      const postData = await getPostById(2);
      if (postData) {
        setPost(postData.data);
      }
    };

    fetchPost();
  }, []); 

  useEffect(() => {
    if (post?.user_id) {
      const fetchUser = async () => {
        const userData = await getUserById(post.user_id);
        if (userData) {
          setUser(userData.data);
        }
      };

      fetchUser();
    }
  }, [post]);

  return (
    <article>
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

            <ArticleContent content={post?.content} />

            {user && <AuthorProfileCard className="md:hidden" user={user} />}
          </div>

          <ArticleShareMenu />

          {post?.comments && post?.comments.length > 0 && (
            <ArticleCommentSection comments={post?.comments} />
          )}
        </div>
        {user && (
          <div className="hidden md:block md:relative w-fit justify-self-end">
            <AuthorProfileCard
              className="my-12 sticky top-12 max-w-[305px] right-0"
              isSticky={true}
              user={user}
            />
          </div>
        )}
      </section>
    </article>
  );
};

export default Article;
