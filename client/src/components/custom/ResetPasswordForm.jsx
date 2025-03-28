import React, { useState } from "react";
import { resetPassword } from "@/api/users";
import { useUser } from "@/hooks/useUser";
import { toast } from "./Toast";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const formScheme = z
    .object({
      currentPassword: z.string().min(6, {
        message: "Current password must be at least 6 characters.",
      }),
      newPassword: z.string().min(6, {
        message: "Password must be at least 6 characters.",
      }),
      confirmPassword: z.string().min(6, {
        message: "Confirm password must match new password.",
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await resetPassword(user.id, {
        current_password: values.currentPassword,
        new_password: values.newPassword,
      });

      toast.success("Password updated successfully");
      form.reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-brown-200 px-4 flex flex-col gap-6 pt-6 pb-10 md:rounded-2xl"
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-brown-400 text-base">
                  Current password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Current password"
                    type="password"
                    className={`bg-white px-4 py-3 !text-brown-400 font-medium`}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-brown-400 text-base">
                  New password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="New password"
                    type="password"
                    className={`bg-white px-4 py-3 !text-brown-400 font-medium`}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-brown-400 text-base">
                  Confirm new password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm new password"
                    type="password"
                    className={`bg-white px-4 py-3 !text-brown-400 font-medium`}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-fit self-start px-10 py-3 rounded-full cursor-pointer md:my-10"
            disabled={loading}
          >
            Reset password
            {loading && <Loader2 className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
