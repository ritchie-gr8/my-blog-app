import React from "react";

import Button from "../global/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Avatar from "../global/Avatar";

const AuthorProfileCard = ({className, isSticky = false}) => {
  return (
    <Card className={`w-full p-6 bg-brown-200 ${className}`}>
      <CardHeader className={`flex items-center gap-3 border-b border-b-brown-300 !pb-[22px] ${isSticky ? 'px-0' : ''}`}>
        <Avatar size="44" />
        <div>
          <CardDescription className="text-b3 text-brown-400 font-medium">
            Author
          </CardDescription>
          <CardTitle className="text-h4 text-brown-500 font-semibold">
            Thompson P.
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className={`${isSticky ? 'px-0' : ''}`}>
        <p className="text-b1 text-brown-400 font-medium">
          I am a pet enthusiast and freelance writer who specializes in animal
          behavior and care. With a deep love for cats, I enjoy sharing insights
          on feline companionship and wellness. 
          <br />
          <br />
          When i’m not writing, I spends
          time volunteering at my local animal shelter, helping cats find loving
          homes.
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthorProfileCard;
