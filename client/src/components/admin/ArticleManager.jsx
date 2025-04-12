import React from "react";
import { Search, Plus, Trash, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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

const ArticleManager = ({
  articles,
  isLoading,
  onEditArticle,
  onCreateArticle,
  categories,
  handleDeleteArticle,
  statusFilter,
  handleStatusFilterChange,
  categoryFilter,
  handleCategoryFilterChange,
  searchTerm,
  handleSearchChange,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b border-brown-300 px-16 py-8">
        <h1 className="text-h3 font-semibold text-brown-600">
          Article management
        </h1>
        <Button
          className="cursor-pointer !text-b1 
              font-medium bg-brown-600 
              text-white !px-10 !py-3 rounded-full"
          onClick={onCreateArticle}
        >
          <Plus size={16} className="mr-2" />
          Create article
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

        <div className="flex gap-4">
          <Select
            placeholder={"Status"}
            value={statusFilter}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select
            placeholder={"Category"}
            value={categoryFilter}
            onValueChange={handleCategoryFilterChange}
          >
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories &&
                categories.map((category) => (
                  <SelectItem value={category.name} key={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles table */}
      <Card className="mx-16 p-0 overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 text-b1 text-brown-400 font-medium">
              <tr>
                <th className="text-left py-4 px-6">Article title</th>
                <th className="text-left py-4 px-6">Category</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex justify-center items-center text-brown-400">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Loading articles...
                    </div>
                  </td>
                </tr>
              ) : !articles || articles?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-brown-400">
                    No articles found
                  </td>
                </tr>
              ) : (
                articles?.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-gray-200 hover:bg-gray-50 font-medium text-b1 text-brown-500"
                  >
                    <td className="py-4 px-6">{article.title}</td>
                    <td className="py-4 px-6">{article.category}</td>
                    <td className="py-4 px-6">
                      <div
                        className={`flex items-center gap-2 ${
                          article.status === "Published"
                            ? "text-brand-green"
                            : "text-brown-400"
                        }`}
                      >
                        <div
                          className={`${
                            article.status === "Published"
                              ? "bg-brand-green animate-pulse"
                              : "bg-brown-400"
                          } size-1.5 rounded-full`}
                        />
                        {article.status}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-brown-400">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => onEditArticle(article.id)}
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
                              <DialogTitle>Delete article</DialogTitle>
                              <DialogDescription>
                                Do you want to delete this article?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() =>
                                    handleDeleteArticle(article.id)
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
  );
};

export default ArticleManager;
