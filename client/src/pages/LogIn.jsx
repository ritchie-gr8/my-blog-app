import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { toast } from "../components/custom/Toast";
import { login as loginApi } from "@/api/auth";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const LogIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const formErrors = form.formState.errors;

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await loginApi(values);

      login(res.data);
      toast.success("Login successful! Redirecting...");

      const destination = location.state?.from || "/";
      navigate(destination);
    } catch (error) {
      toast.error(
        "Your password is incorrect or this email doesn't exist",
        error?.message || "error logging in..."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="bg-brown-200 px-4 py-10 w-full mt-10 mx-4 rounded-2xl 
        md:mt-16 md:mx-32 md:px-16 md:py-16
        lg:mx-80 lg:px-32"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex flex-col"
          >
            <h2 className="text-center text-h2 font-semibold">Log in</h2>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-brown-400 text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      type="email"
                      className={`bg-white px-4 py-3 !text-brown-400 font-medium
                        ${
                          formErrors.email
                            ? "border-2 border-brand-red text-brand-red"
                            : "border-2 border-gray-300"
                        }`}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-brown-400 text-base">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className={`bg-white px-4 py-3 text-brown-400 font-medium
                        ${
                          formErrors.password
                            ? "border-2 border-brand-red text-brand-red"
                            : "border-2 border-gray-300"
                        }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-fit self-center px-10 py-3 rounded-full cursor-pointer md:my-10"
              disabled={loading}
            >
              Log in
              {loading && <Loader2 className="animate-spin" />}
            </Button>

            <p className="text-brown-400 font-medium self-center">
              Don't have any account?
              <Link to="/signup">
                <span className="text-brown-600 ml-3 underline cursor-pointer">
                  Sign up
                </span>
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LogIn;
