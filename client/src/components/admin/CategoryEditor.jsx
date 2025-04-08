import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../custom/Toast";
import { createCategory, updateCategory } from "@/api/categories";
import { ArrowLeft, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

const CategoryEditor = ({ categoryId, setMode, refreshList, categoryName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: categoryId ? categoryName : "",
    },
  });

  const handleSave = async (data) => {
    try {
      setIsLoading(true);

      if (categoryId) {
        await updateCategory(categoryId, data);
        toast.success(
          "Update category",
          "Category has been successfully updated."
        );
      } else {
        await createCategory(data);
        toast.success(
          "Create category",
          "Category has been successfully created."
        );
      }

      form.reset();
      refreshList();
      setMode("list");
    } catch (error) {
      toast.error("Error", error?.message || "Internal server error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b border-brown-300 px-16 py-8">
      <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-brown-500 cursor-pointer"
            onClick={() => setMode("list")}
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-h3 font-semibold text-brown-600">
            {categoryId ? "Edit category" : "Create category"}
          </h1>
        </div>
        <Button
          className="cursor-pointer !text-b1 
              font-medium bg-brown-600 
              text-white !px-10 !py-3 rounded-full"
          onClick={form.handleSubmit(handleSave)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {categoryId ? "Update" : "Save"}
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6 mx-16 my-10 max-w-[480px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Category name
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white"
                    placeholder="Category name"
                    disabled={isLoading}
                    {...field}
                    ref={ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};

export default CategoryEditor;
