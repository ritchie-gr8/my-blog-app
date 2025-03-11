import React from "react";
import Button from "./Button";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-[#DAD6D1]">
      <div className="container mx-auto flex items-center justify-between px-6 py-3 md:px-0">
        <div>
          <img src="/logo.svg" alt="logo" />
        </div>

        <div>
          <Menu className="sm:hidden cursor-pointer" />
          <div className="hidden sm:flex gap-2">
            <Button>Log in</Button>
            <Button variant={'secondary'}>Sign up</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
