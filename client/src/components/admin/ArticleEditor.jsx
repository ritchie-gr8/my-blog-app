import React from "react";
import { ArrowLeft, Image } from "lucide-react";
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

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  authorName: z.string().optional(),
  introduction: z.string().max(120, { message: "Introduction must be 120 characters or less" }),
  content: z.string().min(1, { message: "Content is required" }),
});

const ArticleEditor = ({ setMode, articles, setArticles }) => {
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

  const handleSaveAsDraft = (data) => {
    const newId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
    setArticles([
      ...articles,
      {
        id: newId,
        title: data.title,
        category: data.category,
        status: "Draft",
      },
    ]);
    setMode("list");
    form.reset();
  };

  const handlePublish = (data) => {
    const newId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
    setArticles([
      ...articles,
      {
        id: newId,
        title: data.title,
        category: data.category,
        status: "Published",
      },
    ]);
    setMode("list");
    form.reset();
  };

  return (
    <div className="px-16 py-8">
      <div className="flex justify-between items-center mb-6 border-b border-brown-300 pb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-brown-500 cursor-pointer"
            onClick={() => setMode("list")}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-h3 font-semibold text-brown-600">
            Create article
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 border-brown-300 text-brown-600 cursor-pointer"
            onClick={form.handleSubmit(handleSaveAsDraft)}
          >
            Save as draft
          </Button>
          <Button
            className="rounded-full px-6 py-2 bg-brown-600 text-white cursor-pointer"
            onClick={form.handleSubmit(handlePublish)}
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
                <FormLabel className="text-b1 font-medium text-brown-600">Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[480px] bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Inspiration">Inspiration</SelectItem>
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
                <FormLabel className="text-b1 font-medium text-brown-600">Author name</FormLabel>
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
                <FormLabel className="text-b1 font-medium text-brown-600">Title</FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white"
                    placeholder="Article title"
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
                <FormDescription>
                  Maximum 120 characters
                </FormDescription>
                <FormControl>
                  <Textarea
                    className="w-full bg-white min-h-20"
                    placeholder="Introduction"
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
                <FormLabel className="text-b1 font-medium text-brown-600">Content</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full bg-white min-h-48 h-[572px]"
                    placeholder="Content"
                    rows={10}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ArticleEditor;