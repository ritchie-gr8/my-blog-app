import React, { useEffect, useState, useCallback } from "react";
import SearchBox from "./custom/SearchBox";
import ArticleCard from "./custom/PostCard";
import { Link } from "react-router-dom";
import { getPostsByPage } from "@/api/posts";
import { toast } from "./custom/Toast";
import { getCategories } from "@/api/categories";
import dayjs from "dayjs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const LIMIT = 6;

const PostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error) => {
    console.error(error);
    toast.error("Error", error?.message || "Internal server error");
  };

  const fetchPosts = useCallback(async (pageNum, limit, categoryName = null) => {
    try {
      setIsLoading(true);
      const { items, page: currentPage, total_pages: totalPages } = await getPostsByPage(pageNum, limit, categoryName);
      setPosts(items);
      setPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
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

    await fetchPosts(1, LIMIT, categoryName === "Highlight" ? null : categoryName);
  }, [selectedCategory, fetchPosts]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isLoading) {
      return;
    }
    
    fetchPosts(
      newPage, 
      LIMIT, 
      selectedCategory?.name === "Highlight" ? null : selectedCategory?.name
    );
  }, [page, totalPages, selectedCategory, fetchPosts, isLoading]);

  useEffect(() => {
    fetchCategories();
    fetchPosts(1, LIMIT);
  }, [fetchCategories, fetchPosts]);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include page 1
      pageNumbers.push(1);
      
      // Calculate start and end pages
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);
      
      // Adjust if we're near the beginning or end
      if (page <= 2) {
        endPage = 3;
      } else if (page >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis before middle pages if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis1');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis2');
      }
      
      // Always include the last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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
        {posts?.map(({ id, image, category, title, introduction, author, updated_at }) => (
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
      
      {totalPages > 1 && (
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(page - 1)}
                className={`select-none ${page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              />
            </PaginationItem>
            
            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={`page-${pageNum}-${index}`}>
                {pageNum === 'ellipsis1' || pageNum === 'ellipsis2' ? (
                  <span className="flex h-10 w-10 items-center justify-center select-none">...</span>
                ) : (
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className="cursor-pointer select-none"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(page + 1)}
                className={`select-none ${page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default PostsSection;
