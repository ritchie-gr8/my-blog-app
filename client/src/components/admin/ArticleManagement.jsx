import React, { useCallback, useEffect, useState } from "react";
import ArticleManager from "./ArticleManager";
import ArticleEditor from "./ArticleEditor";
import { toast } from "../custom/Toast";
import { deletePost, getPostsByPage } from "@/api/posts";
import TablePagination from "@/components/custom/TablePagination";
import { getCategories } from "@/api/categories";
import { v4 as uuidv4 } from "uuid";
import { useDebounce } from "@/hooks/useDebouce";

const LIMIT = 10;

const ArticleManagement = () => {
  const [mode, setMode] = useState("list");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState();
  const [categoryFilter, setCategoryFilter] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleError = (error) => {
    console.error(error);
    toast.error("Error", error?.message || "Internal server error");
  };

  const fetchArticles = useCallback(
    async (pageNum, limit, category = null, status = null, search = null) => {
      try {
        setIsLoading(true);
        const {
          items,
          page: currentPage,
          total_pages: totalPages,
        } = await getPostsByPage(
          pageNum,
          limit,
          category,
          null,
          status,
          search
        );
        setArticles(items);
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
      const newCategories = [{ id: uuidv4(), name: "All" }, ...data];
      setCategories(newCategories);
    } catch (error) {
      handleError(error);
    }
  }, []);

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

      fetchArticles(
        newPage,
        LIMIT,
        categoryFilter?.toLowerCase() === "all" ? null : categoryFilter,
        statusFilter?.toLowerCase() === "all" ? null : statusFilter,
        debouncedSearch || null
      );
    },
    [
      page,
      totalPages,
      fetchArticles,
      isLoading,
      categoryFilter,
      statusFilter,
      debouncedSearch,
    ]
  );

  const handleEditArticle = (articleId) => {
    setCurrentArticleId(articleId);
    setMode("editor");
  };

  const handleCreateArticle = () => {
    setCurrentArticleId(null);
    setMode("editor");
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await deletePost(articleId);
      toast.success("Article deleted successfully");
      fetchArticles(
        page,
        LIMIT,
        categoryFilter?.toLowerCase() === "all" ? null : categoryFilter,
        statusFilter?.toLowerCase() === "all" ? null : statusFilter,
        debouncedSearch || null
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    fetchArticles(
      1,
      LIMIT,
      categoryFilter?.toLowerCase() === "all" ? null : categoryFilter,
      newStatus.toLowerCase() === "all" ? null : newStatus,
      debouncedSearch || null
    );
  };

  const handleCategoryFilterChange = (newCategory) => {
    setCategoryFilter(newCategory);
    fetchArticles(
      1,
      LIMIT,
      newCategory.toLowerCase() === "all" ? null : newCategory,
      statusFilter?.toLowerCase() === "all" ? null : statusFilter,
      debouncedSearch || null
    );
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      fetchArticles(
        1,
        LIMIT,
        categoryFilter?.toLowerCase() === "all" ? null : categoryFilter,
        statusFilter?.toLowerCase() === "all" ? null : statusFilter,
        debouncedSearch || null
      );
    }
  }, [debouncedSearch, fetchArticles, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchArticles(1, LIMIT);
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  return (
    <div>
      {mode === "list" && (
        <>
          <ArticleManager
            articles={articles}
            isLoading={isLoading}
            categories={categories}
            onEditArticle={handleEditArticle}
            onCreateArticle={handleCreateArticle}
            statusFilter={statusFilter}
            handleDeleteArticle={handleDeleteArticle}
            handleStatusFilterChange={handleStatusFilterChange}
            categoryFilter={categoryFilter}
            handleCategoryFilterChange={handleCategoryFilterChange}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
          {totalPages > 1 && (
            <div className="mx-16 mt-6 mb-10">
              <TablePagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </div>
          )}
        </>
      )}
      {mode === "editor" && (
        <ArticleEditor
          categories={categories}
          setMode={setMode}
          articles={articles}
          setArticles={setArticles}
          articleId={currentArticleId}
          setArticleId={setCurrentArticleId}
          refreshList={() => fetchArticles(page, LIMIT)}
          handleDeleteArticle={handleDeleteArticle}
        />
      )}
    </div>
  );
};

export default ArticleManagement;
