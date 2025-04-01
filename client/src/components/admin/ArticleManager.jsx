import React from "react";
import { Search, Plus, Trash, Pencil } from "lucide-react";
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

const ArticleManager = ({ setMode, articles }) => {


  return (
    <>
      <div className="flex justify-between items-center mb-6  border-b border-brown-300 px-16 py-8">
        <h1 className="text-h3 font-semibold text-brown-600">
          Article management
        </h1>
        <Button
          className="cursor-pointer !text-b1 
              font-medium bg-brown-600 
              text-white !px-10 !py-3 rounded-full"
          onClick={() => setMode("editor")}
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
          <Input className="pl-10 bg-white" placeholder="Search..." />
        </div>

        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="inspiration">Inspiration</SelectItem>
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
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-gray-200 hover:bg-gray-50 font-medium text-b1 text-brown-500"
                >
                  <td className="py-4 px-6">{article.title}</td>
                  <td className="py-4 px-6">{article.category}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-brand-green">
                      <div className="bg-brand-green size-1.5 rounded-full animate-pulse" />
                      Published
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-brown-400">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
};

export default ArticleManager;
