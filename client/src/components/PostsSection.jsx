import React, { useEffect, useState } from "react";
import SearchBox from "./custom/SearchBox";
import ArticleCard from "./custom/PostCard";
import { blogPosts } from "@/constants/blogPost";
import { Link } from "react-router-dom";
import { getPosts } from "@/api/posts";
import { toast } from "./custom/Toast";

const PostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 6;

  const handleFilterChange = (postType) => {
    if (postType !== "Highlight") {
      setPosts(blogPosts.filter((post) => post.category === postType));
      return;
    }

    setPosts(blogPosts);
  };

  const handleViewMore = async () => {
    try {
      const { data } = await getPosts(offset + limit);
      setPosts((prevPosts) => [...prevPosts, ...data]);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      toast.error("Error", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        console.log(data);
        setPosts(data);
      } catch (error) {
        toast.error("Error", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="md:mx-32">
      <h3 className="text-h3 m-4">Latest articles</h3>
      <SearchBox onFilterChange={handleFilterChange} />
      <article className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link to={`/posts/${post.id}`} key={post.id}>
            <ArticleCard
              image={post.image}
              category={post.category}
              title={post.title}
              description={post.introduction}
              author={post.author}
              date={new Date(post.updated_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          </Link>
        ))}
      </article>
      <button
        className="w-full font-medium text-brown-600 underline text-center mt-6 mb-14 cursor-pointer sm:mt-14 sm:mb-28"
        onClick={handleViewMore}
      >
        View more
      </button>
    </section>
  );
};

export default PostsSection;
