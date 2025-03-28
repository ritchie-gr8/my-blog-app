import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import ImageUploader from "./ImageUploader";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { uploadImage } from "@/api/uploadcare";
import { updateUser } from "@/api/users";
import { toast } from "./Toast";

const ProfileForm = () => {
  const { user, updateUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profile_picture);

  const formSchema = z.object({
    name: z.string().min(6, {
      message: "Name must be at least 6 characters.",
    }),
    username: z.string().min(6, {
      message: "Username must be at least 6 characters.",
    }),
    profile_picture: z.string(),
    email: z.string().email(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      profile_picture: user.profile_picture || "",
      email: user.email || "",
    },
  });

  const handleImageChange = ({ url, file }) => {
    setPreviewUrl(url);
    setImageFile(file);
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      let imageUrl = user.profile_picture;

      if (imageFile) {
        // TODO: handle image upload error
        const { fileId } = await uploadImage(imageFile);
        const uploadedUrl = `https://ucarecdn.com/${fileId}/${imageFile.name}`;
        imageUrl = uploadedUrl;
      }

      const updateData = {
        ...values,
        profile_picture: imageUrl,
      };

      const { data } = await updateUser(user.id, updateData);
      updateUserData(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-brown-200 px-4 flex flex-col gap-6 md:rounded-2xl"
        >
          <FormField
            control={form.control}
            name="profile_picture"
            render={() => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <ImageUploader
                    imageUrl={previewUrl}
                    onImageChange={handleImageChange}
                  />
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
            name="email"
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
            disabled={loading}
          >
            Save
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
