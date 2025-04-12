import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const RegistrationSuccess = ({ onContinue }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="bg-brown-200 px-4 py-10 w-full mt-10 mx-4 rounded-2xl text-center
        md:mt-16 md:mx-32 md:px-16 md:py-16
        lg:mx-80 lg:px-32"
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-green-500 rounded-full p-2 w-12 h-12 flex items-center justify-center">
            <CheckCircle className="text-white w-8 h-8" />
          </div>
          
          <h2 className="text-center text-h2 font-semibold text-gray-800">
            Registration success
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

export default RegistrationSuccess;