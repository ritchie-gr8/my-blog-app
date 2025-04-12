import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { Loader2, Pencil, Plus, Search, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  deleteCategory,
  getPaginatedCategories,
} from "@/api/categories";
import { toast } from "../custom/Toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import CategoryEditor from "./CategoryEditor";
import TablePagination from "../custom/TablePagination";
import { useDebounce } from "@/hooks/useDebouce";

const LIMIT = 10;

const CategoryManagement = () => {
  const [mode, setMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const abortControllerRef = useRef(null);

  const handleError = (error) => {
    if (error.name === 'AbortError' || error.name === "CanceledError") return;

    console.error(error);
    toast.error("Error", error?.message || "Internal server error");
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const onEditCategory = (id, name) => {
    setMode("edit");
    setCategoryId(id);
    setCategoryName(name);
  };

  const onCreateCategory = () => {
    setMode("edit");
    setCategoryId(null);
  };

  const onDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      toast.success(
        "Delete category",
        "Category has been successfully deleted."
      );
      fetchCategories();
    } catch (error) {
      handleError(error);
    }
  };

  const handlePageChange = (page) => {
    if (page === currentPage || isLoading) return;
    setCurrentPage(page);
  };

  const fetchCategories = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      const { data } = await getPaginatedCategories({
        page: currentPage,
        limit: LIMIT,
        name: debouncedSearchTerm,
      }, abortControllerRef.current.signal);
      
      setCategories(data?.items || []);
      setTotalPages(data?.total_pages || 0);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [debouncedSearchTerm, currentPage]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      {mode === "list" && (
        <>
          <div className="flex justify-between items-center mb-6 border-b border-brown-300 px-16 py-8">
            <h1 className="text-h3 font-semibold text-brown-600">
              Category management
            </h1>
            <Button
              className="cursor-pointer !text-b1 
              font-medium bg-brown-600 
              text-white !px-10 !py-3 rounded-full"
              onClick={onCreateCategory}
            >
              <Plus size={16} className="mr-2" />
              Create category
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 justify-between mx-16 mt-10 mb-4">
            <div className="relative w-96 text-brown-400 text-b1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={16}
              />
              <Input
                className="pl-10 bg-white"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Category table */}
          <Card className="mx-16 p-0 overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50 text-b1 text-brown-400 font-medium">
                  <tr>
                    <th className="text-left py-4 px-6">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="2" className="py-20 text-center">
                        <div className="flex justify-center items-center text-brown-400">
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Loading categories...
                        </div>
                      </td>
                    </tr>
                  ) : !categories || categories?.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="py-20 text-center">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-gray-200 hover:bg-gray-50 font-medium text-b1 text-brown-500"
                      >
                        <td className="py-4 px-6 flex items-center justify-between">
                          <div>{category.name}</div>
                          <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() =>
                                onEditCategory(category.id, category.name)
                              }
                            >
                              <Pencil size={16} />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="cursor-pointer"
                                >
                                  <Trash size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete category</DialogTitle>
                                  <DialogDescription>
                                    Do you want to delete this category?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() =>
                                        onDeleteCategory(category.id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
      {mode === "edit" && (
        <CategoryEditor
          categoryId={categoryId}
          setMode={setMode}
          refreshList={fetchCategories}
          categoryName={categoryName}
        />
      )}
      {totalPages > 1 && mode === "list" && (
        <div className="mx-16 mt-6 mb-10">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
