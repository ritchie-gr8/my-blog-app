import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const LoginDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex flex-col items-center'>
        <DialogHeader>
          <DialogTitle className='text-h2 text-center mt-6'>Create an account to continue</DialogTitle>
          <DialogDescription className='mx-auto my-10'>
            <Link to="/signup">
              <Button className="cursor-pointer px-10 py-4 rounded-full !text-b1 bg-brown-600 text-white hover:bg-brown-500">
                Create an account
              </Button>
            </Link>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='font-medium text-brown-400'>
          Already have an account?
          <Link to="/login">
            <span className="cursor-pointer underline text-brown-500">
              Log In
            </span>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
