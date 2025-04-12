import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AuthorProfileCard = ({ className, isSticky = false, user }) => {
  return (
    <Card className={`w-full p-6 bg-brown-200 ${className}`}>
      <CardHeader
        className={`flex items-center gap-3 border-b border-b-brown-300 !pb-[22px] ${
          isSticky ? "px-0" : ""
        }`}
      >
        <Avatar className="size-12">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardDescription className="text-b3 text-brown-400 font-medium">
            Author
          </CardDescription>
          <CardTitle className="text-h4 text-brown-500 font-semibold">
            {user.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className={`${isSticky ? "px-0" : ""}`}>
        <p className="text-b1 text-brown-400 font-medium">{user.bio}</p>
      </CardContent>
    </Card>
  );
};

export default AuthorProfileCard;
