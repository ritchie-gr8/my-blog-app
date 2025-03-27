import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import Avatar from "../global/Avatar";
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";

const uploadcareApiUrl = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;

const ProfileForm = () => {
  const formSchema = z.object({
    name: z.string().min(6, {
      message: "Name must be at least 6 characters.",
    }),
    username: z.string().min(6, {
      message: "Username must be at least 6 characters.",
    }),
    imageUrl: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      imageUrl: "",
    },
  });

  const formErrors = form.formState.errors;

  const handleChangeEvent = (e) => {
    console.log(e.cdnUrl);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit()}
          className="bg-brown-200 px-4 flex flex-col gap-6 md:rounded-2xl"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={() => (
              <FormItem className="flex flex-col items-center justify-center ">
                <FormControl>
                  <ImageUploader />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel className="font-medium text-brown-400 text-base">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name..."
                      type="text"
                      {...field}
                      className={`bg-white px-4 py-3 text-brown-400 font-medium`}
                    />
                  </FormControl>
                </FormItem>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel className="font-medium text-brown-400 text-base">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your username..."
                      type="text"
                      {...field}
                      className={`bg-white px-4 py-3 text-brown-400 font-medium`}
                    />
                  </FormControl>
                </FormItem>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormItem>
                  <FormLabel className="font-medium text-brown-400 text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email..."
                      disabled={true}
                      type="text"
                      {...field}
                      className={`bg-white px-4 py-3 text-brown-400 font-medium`}
                    />
                  </FormControl>
                </FormItem>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-fit self-start px-10 py-3 rounded-full cursor-pointer md:my-10 mb-6 "
            // disabled={loading}
          >
            Save
            {/* {loading && <Loader2 className="animate-spin" />} */}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
