"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, LogOut, RotateCcw, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import useDropdown from "@/hooks/useDropdown";

const UserAvatarDropdown = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { isOpen, dropdownRef, toggleDropdown } = useDropdown();

  const { username, name, email, profile_picture } = user;

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleManageAccount = () => {
    navigate("/member?tab=profile");
    toggleDropdown();
  };

  const handleResetPassword = () => {
    navigate("/member?tab=password");
    toggleDropdown();
  };

  return (
    <div
      className="relative flex items-center gap-2 group transition-opacity cursor-pointer"
      ref={dropdownRef}
      onClick={toggleDropdown}
    >
      <Avatar className="size-9 cursor-pointer">
        <AvatarImage src={profile_picture} />
        <AvatarFallback className="bg-brown-600 text-white">
          {name[0]}
        </AvatarFallback>
      </Avatar>
      <span>{username}</span>
      <ChevronDown className="size-4 group-hover:scale-125 transition-transform" />
      {isOpen && (
        <Card className="absolute right-0 top-8 mt-2 w-64 p-4 bg-white rounded-lg shadow-lg z-50 !gap-0">
          <div className="flex items-center gap-3 mb-4 cursor-default">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile_picture} />
              <AvatarFallback className="bg-brown-600 text-white">
                {name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{name}</span>
              <span className="text-xs text-gray-400">{email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 justify-start hover:bg-brown-600 hover:text-white cursor-pointer"
              onClick={handleManageAccount}
            >
              <UserPen />
              Profile
            </Button>

            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 justify-start hover:bg-brown-600 hover:text-white cursor-pointer"
              onClick={handleResetPassword}
            >
              <RotateCcw />
              Reset password
            </Button>

            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 justify-start hover:bg-brown-600 hover:text-white cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut />
              Log out
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserAvatarDropdown;
