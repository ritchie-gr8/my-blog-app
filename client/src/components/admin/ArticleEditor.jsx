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
import { createPost, getPostById, updatePost } from "@/api/posts";
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
import PostThumbnailUploader from "./PostThumbnailUploader";
import { uploadImage } from "@/api/uploadcare";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.number().min(1, { message: "Please select a category" }),
  thumbnailImage: z.string().optional(),
  authorName: z.string().optional(),
  introduction: z
    .string()
    .min(1, { message: "Introduction is required" })
    .max(120, { message: "Introduction must be 120 characters or less" }),
  content: z.string().min(1, { message: "Content is required" }),
});

const ArticleEditor = ({
  setMode,
  articleId,
  setArticleId,
  categories,
  refreshList,
  handleDeleteArticle,
  authorName,
}) => {
  const isEditMode = articleId !== null;
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      thumbnailImage: "",
      authorName: "",
      introduction: "",
      content: "",
    },
  });

  useEffect(() => {
    const resetForm = (authorName) => {
      form.reset({
        title: "",
        category: 0,
        thumbnailImage: "",
        authorName: authorName || "",
        introduction: "",
        content: "",
      });
    };

    const newCategories = categories.slice(1);
    setCategoryList(newCategories);

    const loadArticleData = async () => {
      if (isEditMode && articleId) {
        setIsLoading(true);
        try {
          const response = await getPostById(articleId);
          const articleData = response.data;

          if (articleData) {
            form.reset({
              title: articleData.title || "",
              category: articleData.category_id || 0,
              thumbnailImage: articleData.thumbnail_image || "",
              authorName: articleData.author.name || "",
              introduction: articleData.introduction || "",
              content: articleData.content || "",
            });

            setPreviewUrl(articleData.thumbnail_image);
          }
        } catch (error) {
          toast.error(error.message || "Failed to fetch article");
          resetForm();
        } finally {
          setIsLoading(false);
        }
      } else if (authorName) {
        resetForm(authorName);
      }
    };

    loadArticleData();
  }, [articleId, form, isEditMode, categories, authorName]);

  const handleSaveArticle = async (data, status) => {
    setIsLoading(true);
    try {
      let uploadedUrl = null;
      if (imageFile) {
        uploadedUrl = await handleUploadImage(imageFile);
      } else {
        uploadedUrl = data.thumbnailImage;
      }

      const articleData = {
        title: data.title,
        category_id: data.category,
        status: status,
        introduction: data.introduction,
        content: data.content,
        thumbnail_image: uploadedUrl,
      };

      if (isEditMode) {
        await updatePost(articleId, articleData);
        toast.success(
          `Edit article and ${
            status.toLowerCase() === "published"
              ? "published"
              : "saved as draft"
          }`,
          `${
            status.toLowerCase() === "published"
              ? "Your article has been successfully published"
              : "You can publish article later"
          }`
        );
      } else {
        await createPost(articleData);
        toast.success(
          `Create article and ${
            status.toLowerCase() === "published"
              ? "published"
              : "saved as draft"
          }`,
          `${
            status.toLowerCase() === "published"
              ? "Your article has been successfully published"
              : "You can publish article later"
          }`
        );
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${status.toLowerCase()} article`);
    } finally {
      setIsLoading(false);
    }

    cleanupAndExit();
  };

  const handleSaveAsDraft = async (data) => {
    await handleSaveArticle(data, "Draft");
  };

  const handlePublish = async (data) => {
    await handleSaveArticle(data, "Published");
  };

  const handleDelete = () => {
    handleDeleteArticle(articleId);
    cleanupAndExit();
  };

  const handleImageChange = ({ url, file }) => {
    setPreviewUrl(url);
    setImageFile(file);
  };

  const handleUploadImage = async (imageFile) => {
    const { fileId } = await uploadImage(imageFile);
    const uploadedUrl = `https://ucarecdn.com/${fileId}/-/format/auto/-/quality/smart/`;
    form.setValue("thumbnailImage", uploadedUrl);
    return uploadedUrl;
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
            <span className="text-brown-600 font-medium">Loading...</span>
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
            <PostThumbnailUploader
              imageUrl={previewUrl}
              onImageChange={handleImageChange}
              isLoading={isLoading}
            />
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
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="w-[480px] bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoryList.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
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
                    placeholder="Author name"
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
      {isEditMode && (
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
      )}
    </div>
  );
};

export default ArticleEditor;
