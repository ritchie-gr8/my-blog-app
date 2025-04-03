import React, { useCallback, useEffect, useState } from "react";
import ArticleManager from "./ArticleManager";
import ArticleEditor from "./ArticleEditor";
import { toast } from "../custom/Toast";
import { getPostsByPage } from "@/api/posts";
import TablePagination from "@/components/custom/TablePagination";

const LIMIT = 10;

const ArticleManagement = () => {
  const [mode, setMode] = useState("list");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleError = (error) => {
    console.error(error);
    toast.error("Error", error?.message || "Internal server error");
  };

  const fetchArticles = useCallback(async (pageNum, limit) => {
    try {
      setIsLoading(true);
      const {
        items,
        page: currentPage,
        total_pages: totalPages,
      } = await getPostsByPage(pageNum, limit);
      setArticles(items);
      setPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || isLoading) {
      return;
    }
    
    fetchArticles(newPage, LIMIT);
  }, [page, totalPages, fetchArticles, isLoading]);

  useEffect(() => {
    fetchArticles(1, LIMIT);
  }, [fetchArticles]);

  return (
    <div>
      {mode === "list" && (
        <>
          <ArticleManager setMode={setMode} articles={articles} isLoading={isLoading} />
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
          setMode={setMode}
          articles={articles}
          setArticles={setArticles}
        />
      )}
    </div>
  );
};

export default ArticleManagement;
