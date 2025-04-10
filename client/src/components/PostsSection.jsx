import React, { useEffect, useState, useCallback } from "react";
import SearchBox from "./custom/SearchBox";
import ArticleCard from "./custom/PostCard";
import { Link } from "react-router-dom";
import { getPostsByPage } from "@/api/posts";
import { toast } from "./custom/Toast";
import { getCategories } from "@/api/categories";
import dayjs from "dayjs";
import TablePagination from "@/components/custom/TablePagination";
import { useDebounce } from "@/hooks/useDebouce";

const LIMIT = 6;

const PostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleError = (error) => {
    toast.error("Error", error?.message || "Internal server error");
  };

  const fetchPosts = useCallback(
    async (pageNum, limit, categoryName = null, searchTerm = null) => {
      try {
        setIsLoading(true);
        const {
          items,
          page: currentPage,
          total_pages: totalPages,
        } = await getPostsByPage(
          pageNum,
          limit,
          categoryName,
          searchTerm,
          "Published"
        );
        setPosts(items);
        setPage(currentPage);
        setTotalPages(totalPages);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await getCategories();
      const categories = [...data];
      setCategories(categories);
      setSelectedCategory(null);
    } catch (error) {
      handleError(error);
    }
  }, []);

  const handleFilterChange = useCallback(
    async (categoryName) => {
      if (categoryName === selectedCategory?.name) {
        return;
      }

      await fetchPosts(1, LIMIT, categoryName, searchTerm);
    },
    [selectedCategory, fetchPosts, searchTerm]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      if (
        newPage < 1 ||
        newPage > totalPages ||
        newPage === page ||
        isLoading
      ) {
        return;
      }

      fetchPosts(newPage, LIMIT, selectedCategory?.name, searchTerm);
    },
    [page, totalPages, selectedCategory, fetchPosts, isLoading, searchTerm]
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      fetchPosts(1, LIMIT, selectedCategory?.name, debouncedSearch);
    }
  }, [debouncedSearch, fetchPosts, selectedCategory]);

  return (
    <section className="md:mx-32">
      <h3 className="text-h3 m-4">Latest articles</h3>
      <SearchBox
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />
      <article className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map(
          ({
            id,
            thumbnail_image,
            category,
            title,
            introduction,
            author_name,
            author_profile_picture,
            updated_at,
          }) => (
            <Link to={`/posts/${id}`} key={id}>
              <ArticleCard
                image={
                  thumbnail_image.trim() === ""
                    ? `https://picsum.photos/360x360`
                    : thumbnail_image
                }
                category={category}
                title={title}
                description={introduction}
                author_name={author_name}
                author_profile_picture={author_profile_picture}
                date={dayjs(updated_at).format("DD MMMM YYYY")}
              />
            </Link>
          )
        )}
      </article>

      {totalPages > 1 && (
        <div className="my-8">
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </section>
  );
};

export default PostsSection;
