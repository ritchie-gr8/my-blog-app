import React, { useState } from "react";
import SearchBox from "./custom/SearchBox";
import ArticleCard from "./custom/PostCard";
import { blogPosts } from "@/constants/blogPost";
import { Link } from "react-router-dom";

const PostsSection = () => {
  const [posts, setPosts] = useState(blogPosts);

  const handleFilterChange = (postType) => {
    if (postType !== "Highlight") {
      setPosts(blogPosts.filter((post) => post.category === postType));
      return;
    }

    setPosts(blogPosts);
  };

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
              description={post.description}
              author={post.author}
              date={post.date}
            />
          </Link>
        ))}
      </article>
      <button className="w-full font-medium text-brown-600 underline text-center mt-6 mb-14 cursor-pointer sm:mt-14 sm:mb-28">
        View more
      </button>
    </section>
  );
};

export default PostsSection;
