import React, { useState } from "react";
import Button from "./Button";
import { LayoutDashboard, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import UserAvatarDropdown from "./UserAvatarDropdown";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useUser();

  const handleShowMobileMenu = () => setShowMobileMenu((prev) => !prev);

  return (
    <header className="border-b border-brown-300 relative">
      <div className="flex items-center justify-between px-6 py-3 md:px-32">
        <div>
          <Link to={"/"} className="flex items-center gap-2 hover:underline">
            <img src="/logo.png" className="size-10" alt="greato's stack & score logo" />
            Stack & Score
          </Link>
        </div>

        <div>
          <Menu
            onClick={() => handleShowMobileMenu()}
            className="sm:hidden cursor-pointer"
          />
          <div className="hidden sm:flex gap-2 items-center">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/dashboard">
                    <Button className="flex items-center gap-2">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Button>
                  </Link>
                )}
                <NotificationBell />
                <UserAvatarDropdown />
              </>
            ) : (
              <>
                <Link to={"/login"}>
                  <Button>Log in</Button>
                </Link>
                <Link to={"/signup"}>
                  <Button variant={"secondary"}>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {showMobileMenu && (
        <div
          className="flex flex-col shadow-[2px_2px_16px_0px_rgba(0,0,0,0.1)]
        px-6 py-10 gap-6 w-full bg-white border-t border-t-brown-300
        absolute top-12"
        >
          {user ? (
            <UserAvatarDropdown />
          ) : (
            <>
              <Link to={"/login"}>
                <Button>Log in</Button>
              </Link>

              <Link to={"/signup"}>
                <Button variant={"secondary"}>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
