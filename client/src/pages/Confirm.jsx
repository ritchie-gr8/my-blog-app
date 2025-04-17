import { activateUser } from "@/api/users";
import { toast } from "@/components/custom/Toast";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Confirm = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onContinue = () => {
    navigate("/login");
  };

  useEffect(() => {
    const activate = async () => {
      try {
        const { success } = await activateUser(token);
        if (!success) throw new Error("Error activating user.");
        setSuccess(true);
      } catch (error) {
        toast.error(error.message);
        setSuccess(false);
      }
    };

    activate();
    setLoading(false);
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="bg-brown-200 px-4 py-10 w-full mt-10 mx-4 rounded-2xl text-center
        md:mt-16 md:mx-32 md:px-16 md:py-16
        lg:mx-80 lg:px-32"
      >
        <div className="flex flex-col items-center space-y-6">
          <div className={`rounded-full p-2 w-12 h-12 flex items-center justify-center ${
            loading
              ? "bg-gray-300"
              : success
                ? "bg-green-500"
                : "bg-red-500"
          }`}>
            {loading && <Loader2 className="animate-spin" />}
            {success && <CheckCircle className="text-white w-8 h-8" />}
            {!loading && !success && <XCircle className="text-white w-8 h-8" />}
          </div>

          <h2 className="text-center text-h2 font-semibold text-gray-800">
            {loading && "Activating..."}
            {!loading && success && "User activated successfully"}
            {!loading && !success && "User activation failed"}
          </h2>

          <Button
            onClick={onContinue}
            className="bg-brown-600 text-white px-8 py-2 rounded-full cursor-pointer"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
