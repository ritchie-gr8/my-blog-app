import React, { useEffect, useState } from "react";
import { ArrowLeft, Image, Loader2, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getPostById } from "@/api/posts";
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

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  authorName: z.string().optional(),
  introduction: z
    .string()
    .max(120, { message: "Introduction must be 120 characters or less" }),
  content: z.string().min(1, { message: "Content is required" }),
});

const ArticleEditor = ({
  setMode,
  articles,
  setArticles,
  articleId,
  setArticleId,
  categories,
  refreshList,
  handleDeleteArticle,
}) => {
  const isEditMode = articleId !== null;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      authorName: "",
      introduction: "",
      content: "",
    },
  });

  useEffect(() => {
    const resetForm = () => {
      form.reset({
        title: "",
        category: "",
        authorName: "",
        introduction: "",
        content: "",
      });
    };

    const loadArticleData = async () => {
      if (isEditMode && articleId) {
        setIsLoading(true);
        try {
          const response = await getPostById(articleId);
          const articleData = response.data;

          if (articleData) {
            form.reset({
              title: articleData.title || "",
              category: articleData.category || "",
              authorName: articleData.author_name || "",
              introduction: articleData.introduction || "",
              content: articleData.content || "",
            });
          }
        } catch (error) {
          toast.error(error.message || "Failed to fetch article");
          resetForm();
        } finally {
          setIsLoading(false);
        }
      } else {
        resetForm();
      }
    };

    loadArticleData();
  }, [articleId, form, isEditMode]);

  const handleSaveAsDraft = (data) => {
    if (isEditMode) {
      // Update existing article
      const updatedArticles = articles.map((article) =>
        article.id === articleId
          ? { ...article, ...data, status: "Draft" }
          : article
      );
      setArticles(updatedArticles);
    } else {
      // Create new article
      const newId =
        articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
      setArticles([
        ...articles,
        {
          id: newId,
          title: data.title,
          category: data.category,
          status: "Draft",
          introduction: data.introduction,
          content: data.content,
          author_name: data.authorName,
        },
      ]);
    }

    // Reset editor state and return to list
    cleanupAndExit();
  };

  const handleDelete = () => {
    handleDeleteArticle(articleId);
    cleanupAndExit();
  };

  const handlePublish = (data) => {
    if (isEditMode) {
      // Update existing article
      const updatedArticles = articles.map((article) =>
        article.id === articleId
          ? { ...article, ...data, status: "Published" }
          : article
      );
      setArticles(updatedArticles);
    } else {
      // Create new article
      const newId =
        articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
      setArticles([
        ...articles,
        {
          id: newId,
          title: data.title,
          category: data.category,
          status: "Published",
          introduction: data.introduction,
          content: data.content,
          author_name: data.authorName,
        },
      ]);
    }

    cleanupAndExit();
  };

  const cleanupAndExit = () => {
    setArticleId(null);
    form.reset();
    setMode("list");
    refreshList();
  };

  return (
    <div className="px-16 py-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 z-10 flex justify-center items-center">
          <div className="flex items-center gap-2 bg-white p-4 rounded-md shadow-md">
            <Loader2 className="h-6 w-6 animate-spin text-brown-600" />
            <span className="text-brown-600 font-medium">
              Loading article data...
            </span>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6 border-b border-brown-300 pb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-brown-500 cursor-pointer"
            onClick={() => cleanupAndExit()}
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-h3 font-semibold text-brown-600">
            {isEditMode ? "Edit article" : "Create article"}
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 border-brown-300 text-brown-600 cursor-pointer"
            onClick={form.handleSubmit(handleSaveAsDraft)}
            disabled={isLoading}
          >
            Save as draft
          </Button>
          <Button
            className="rounded-full px-6 py-2 bg-brown-600 text-white cursor-pointer"
            onClick={form.handleSubmit(handlePublish)}
            disabled={isLoading}
          >
            Save and publish
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Thumbnail */}
          <div className="mb-6">
            <h2 className="text-b1 font-medium text-brown-600 mb-2">
              Thumbnail image
            </h2>
            <div className="flex items-end gap-4">
              <div className="border border-gray-200 rounded-md bg-gray-50 h-64 w-[460px] flex items-center justify-center">
                <Image size={24} className="text-gray-400" />
              </div>
              <Button
                variant="outline"
                type="button"
                className="rounded-md px-4 py-2 text-sm border-brown-300 text-brown-600"
                disabled={isLoading}
              >
                Upload thumbnail image
              </Button>
            </div>
          </div>

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Category
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-[480px] bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem value={category.name} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author Name */}
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Author name
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-[480px] bg-white"
                    placeholder="Thompson P."
                    disabled={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white"
                    placeholder="Article title"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Introduction */}
          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Introduction
                </FormLabel>
                <FormDescription>Maximum 120 characters</FormDescription>
                <FormControl>
                  <Textarea
                    className="w-full bg-white min-h-20"
                    placeholder="Introduction"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Content
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full bg-white min-h-48 h-[572px]"
                    placeholder="Content"
                    rows={10}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 mt-7 underline cursor-pointer text-brown-600 text-b1 font-medium">
            <Trash size={16} />
            Delete article
          </div>
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
              <Button onClick={handleDelete}>Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticleEditor;
