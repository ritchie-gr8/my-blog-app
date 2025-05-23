import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RegistrationSuccess from "@/components/custom/RegistrationSuccess";
import { toast } from "@/components/custom/Toast";
import { registerUser } from "@/api/users";
import { useUser } from "@/hooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const SignUp = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const formSchema = z.object({
    name: z.string().min(6, {
      message: "Name must be at least 6 characters.",
    }),
    username: z.string().min(6, {
      message: "Username must be at least 6 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const formErrors = form.formState.errors;

  async function onSubmit(values) {
    try {
      setLoading(true);
      const res = await registerUser(values);
      setIsRegistered(true);
      login(res);
      toast.success("User registered successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  }

  const handleContinue = () => {
    navigate("/");
  };

  if (isRegistered) {
    return <RegistrationSuccess onContinue={handleContinue} />;
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
            <h2 className="text-center text-h2 font-semibold">Sign up</h2>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-brown-400 text-base">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full name"
                      disabled={loading}
                      className={`bg-white px-4 py-3 !text-brown-400 font-medium
                        ${
                          formErrors.name
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

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-brown-400 text-base">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      disabled={loading}
                      className={`bg-white px-4 py-3 !text-brown-400 font-medium
                        ${
                          formErrors.username
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

            {/* Email Field */}
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
                      disabled={loading}
                      className={`bg-white px-4 py-3 !text-brown-400 font-medium
                        ${
                          formErrors.email
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium !text-brown-400 text-base">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      disabled={loading}
                      className={`bg-white px-4 py-3 !text-brown-400 font-medium
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
              className="w-fit self-center bg-brown-600 px-10 py-3 rounded-full cursor-pointer md:my-10"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  Signing up... <Loader2 className="animate-spin ml-2" />
                </span>
              ) : (
                "Sign up"
              )}
            </Button>

            <p className="text-brown-400 font-medium self-center">
              Already have an account?
              <Link to="/login">
                <span className="text-brown-600 ml-3 underline cursor-pointer">
                  Log in
                </span>
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
