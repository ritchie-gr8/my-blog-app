import React, { useEffect, useState, useCallback } from "react";
import SearchBox from "./custom/SearchBox";
import ArticleCard from "./custom/PostCard";
import { Link } from "react-router-dom";
import { getPosts } from "@/api/posts";
import { toast } from "./custom/Toast";
import { getCategories } from "@/api/categories";
import dayjs from "dayjs";

const LIMIT = 6;

const PostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [offset, setOffset] = useState(0);

  const handleError = (error) => {
    console.error(error);
    toast.error("Error", error?.message || "Internal server error");
  };

  const fetchPosts = useCallback(async (offset, limit, categoryName = null) => {
    try {
      const { data } = await getPosts(offset, limit, categoryName);
      setPosts(data);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getCategories();
      const categories = [{ id: 0, name: "Highlight" }, ...data];
      setCategories(categories);
      setSelectedCategory(categories[0]);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const handleFilterChange = useCallback(async (categoryName) => {
    if (categoryName === selectedCategory?.name) {
      return;
    }

    const newOffset = categoryName === "Highlight" ? 0 : offset;
    await fetchPosts(newOffset, LIMIT, categoryName === "Highlight" ? null : categoryName);
  }, [selectedCategory, offset, fetchPosts]);

  const handleViewMore = useCallback(async () => {
    try {
      const { data } = await getPosts(
        offset + LIMIT,
        LIMIT,
        selectedCategory?.name === "Highlight" ? null : selectedCategory?.name
      );
      setPosts((prevPosts) => [...prevPosts, ...data]);
      setOffset((prevOffset) => prevOffset + LIMIT);
    } catch (error) {
      handleError(error);
    }
  }, [offset, selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchPosts(0, LIMIT);
  }, [fetchCategories, fetchPosts]);

  return (
    <section className="md:mx-32">
      <h3 className="text-h3 m-4">Latest articles</h3>
      <SearchBox
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onFilterChange={handleFilterChange}
      />
      <article className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {posts.map(({ id, image, category, title, introduction, author, updated_at }) => (
          <Link to={`/posts/${id}`} key={id}>
            <ArticleCard
              image={image}
              category={category}
              title={title}
              description={introduction}
              author={author} 
              date={dayjs(updated_at).format('DD MMMM YYYY')}
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
