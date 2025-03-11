import React, { useState } from "react";
import Button from "./Button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleShowMobileMenu = () => setShowMobileMenu(prev => !prev);

  return (
    <header className="border-b border-brown-300 relative">
      <div className="container mx-auto flex items-center justify-between px-6 py-3 md:px-0">
        <div>
          <img src="/logo.svg" alt="logo" />
        </div>

        <div>
          <Menu onClick={() => handleShowMobileMenu()} className="sm:hidden cursor-pointer" />
          <Menu onClick={() => handleShowMobileMenu()} className="sm:hidden cursor-pointer" />
          <div className="hidden sm:flex gap-2">
            <Button>Log in</Button>
            <Button variant={"secondary"}>Sign up</Button>
            <Button variant={"secondary"}>Sign up</Button>
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div
          className="flex flex-col shadow-[2px_2px_16px_0px_rgba(0,0,0,0.1)] 
        px-6 py-10 gap-6 w-full bg-white border-t border-t-brown-300 
        absolute top-12"
        >
          <Button>Log in</Button>
          <Button variant={"secondary"}>Sign up</Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
