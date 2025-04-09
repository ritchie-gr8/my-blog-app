import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/api/users";
import { useUser } from "@/hooks/useUser";
import { toast } from "../custom/Toast";

const formSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Current password must be at least 6 characters long",
    }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const PasswordManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      await resetPassword(user.id, data);
      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 border-b border-brown-300 px-16 py-8">
        <h1 className="text-h3 font-semibold text-brown-600">Reset password</h1>
        <Button
          className="cursor-pointer !text-b1 
              font-medium bg-brown-600 
              text-white !px-10 !py-3 rounded-full"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Reset password
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6 mx-16 my-10 max-w-[480px]">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white"
                    placeholder="Current password"
                    {...field}
                    type="password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white"
                    placeholder="New password"
                    {...field}
                    type="password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    className="w-full bg-white"
                    placeholder="Confirm new password"
                    {...field}
                    type="password"
                    disabled={isLoading}
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

export default PasswordManagement;
