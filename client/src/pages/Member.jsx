import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, UserPen } from "lucide-react";
import ProfileForm from "@/components/custom/ProfileForm";
import ResetPasswordForm from "@/components/custom/ResetPasswordForm";
import { useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Member = () => {
  const [currentTab, setCurrentTab] = useState("profile");
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");

    if (tabParam && (tabParam === "profile" || tabParam === "password")) {
      setCurrentTab(tabParam);
    }
  }, [location.search]);

  return (
    <div className="flex justify-center items-center">
      <Tabs value={currentTab} className="w-full">
        <div className="hidden md:flex items-center px-32 mt-14 text-h3 font-semibold">
          <Avatar className='size-[60px]'>
            <AvatarImage src={user.profile_picture} />
            <AvatarFallback className='bg-brown-400 text-white'>
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <h3 className="px-4 border-r mr-4 text-brown-400">{user.name}</h3>
          <h3>{currentTab === "profile" ? "Profile" : "Reset password"}</h3>
        </div>
        <div className="w-full flex flex-col md:flex-row md:px-32 md:mt-12">
          <TabsList
            className="px-4 mt-6 w-full flex md:flex-col 
          md:px-0 md:py-0 md:my-0 md:h-fit md:max-w-[244px] md:gap-3 md:bg-brown-100 md:mr-3"
          >
            <TabsTrigger
              value="profile"
              className="w-full"
              onClick={() => setCurrentTab("profile")}
            >
              <UserPen />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="w-full"
              onClick={() => setCurrentTab("password")}
            >
              <RotateCcw />
              Reset password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="flex items-center md:hidden">
              <div className="flex items-center gap-3 border-r px-4 my-6">
                <Avatar /> Moodeng ja
              </div>
              <h4 className="px-4 text-h4 font-semibold">Profile</h4>
            </div>
            <ProfileForm />
          </TabsContent>
          <TabsContent value="password">
            <div className="flex items-center md:hidden">
              <div className="flex items-center gap-3 border-r px-4 my-6">
                <Avatar /> Moodeng ja
              </div>
              <h4 className="px-4">Reset password</h4>
            </div>
            <ResetPasswordForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Member;
