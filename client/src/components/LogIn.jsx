import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";

const LogIn = () => {
  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const formErrors = form.formState.errors;

  function onSubmit(values) {
    //TODO: implement onSubmit
    console.log(values);
  }


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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-brown-400 text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className={`bg-white px-4 py-3 !text-brown-400 font-medium
                        ${
                          formErrors.username
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
              name="Password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-brown-400 text-base">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
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
            >
              Log in
            </Button>

            <p className="text-brown-400 font-medium self-center">
              Don’t have any account?
              <span className="text-brown-600 ml-3 underline cursor-pointer">
                Sign up
              </span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LogIn;
