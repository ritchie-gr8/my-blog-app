import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import ImageUploader from "../custom/ImageUploader";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../custom/Toast";
import { updateUser } from "@/api/users";
import { uploadImage } from "@/api/uploadcare";
import { useUser } from "@/hooks/useUser";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  bio: z
    .string()
    .min(1, { message: "Bio is required" })
    .max(120, { message: "Bio must be less than 120 characters" }),
  profile_picture: z.string().optional(),
});

const ProfileManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const { user, updateUserData } = useUser();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      bio: "",
      profile_picture: "",
    },
  });

  useEffect(() => {
    // If user data is available, set form values
    if (user) {
      form.reset({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        profile_picture: user.profile_picture || "",
      });
      setPreviewUrl(user.profile_picture || "");
    }
  }, [user, form]);

  const handleImageChange = ({ url, file }) => {
    setPreviewUrl(url);
    setImageFile(file);
  };

  const handleSave = async (data) => {
    try {
      setIsLoading(true);

      let profilePictureUrl = data.profile_picture;
      if (imageFile) {
        const { fileId } = await uploadImage(imageFile);
        profilePictureUrl = `https://ucarecdn.com/${fileId}/${imageFile.name}`;
      }

      const userData = {
        ...data,
        profile_picture: profilePictureUrl,
      };

      const response = await updateUser(user.id, userData);

      if (response && response.data) {
        updateUserData(response.data);
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-brown-300 px-16 py-8">
        <h1 className="text-h3 font-semibold text-brown-600">Profile</h1>
        <Button
          className="cursor-pointer !text-b1 
              font-medium bg-brown-600 
              text-white !px-10 !py-3 rounded-full"
          onClick={form.handleSubmit(handleSave)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save
        </Button>
      </div>

      <Form {...form}>
        <form className="px-16 py-8 space-y-6">
          <div>
            <ImageUploader
              variant="row"
              className="border-b border-brown-300 w-fit pb-10"
              imageUrl={previewUrl}
              onImageChange={handleImageChange}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white max-w-[480px]"
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white max-w-[480px]"
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white max-w-[480px]"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-b1 font-medium text-brown-600">
                  Bio{" "}
                  <span className="text-b2 font-normal text-brown-400">
                    (max 120 letters)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full bg-white h-[120px]"
                    placeholder="Bio"
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

export default ProfileManagement;
