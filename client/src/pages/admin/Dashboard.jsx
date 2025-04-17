import React, { useState } from "react";
import { LogOut, ExternalLink } from "lucide-react";
import { adminMenu } from "@/constants/adminMenu";
import ArticleManagement from "@/components/admin/ArticleManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import ProfileManagement from "@/components/admin/ProfileManagement";
import { Link, useNavigate } from "react-router-dom";
import PasswordManagement from "@/components/admin/PasswordManagement";
import { useUser } from "@/hooks/useUser";
import NotificationManagement from "@/components/admin/NotificationManagement";
import { frontEndUrl } from "@/constants/urls";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("article");
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-brown-200">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 h-full flex flex-col">
        <div className="px-6 pt-24 pb-16">
          <div className="w-[53px]">
            <img src="/logo.svg" alt="logo" className="w-full" />
          </div>
          <p className="text-brand-orange font-semibold text-h4 mt-6">
            Admin panel
          </p>
        </div>

        <nav className="flex flex-col flex-1 justify-between">
          <div>
            {adminMenu.map((menu) => (
              <div
                className={`flex items-center gap-3 px-6 py-5 text-b1 font-medium
               cursor-pointer text-brown-500 hover:bg-brown-300 ${
                 activeTab === menu.tab ? "bg-brown-300" : ""
               }`}
                key={menu.id}
                onClick={() => setActiveTab(menu.tab)}
              >
                <menu.icon size={18} />
                <span>{menu.title}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-12">
            <Link to={frontEndUrl} target="_blank">
              <div
                className="flex items-center gap-3 px-6 py-5 text-b1 font-medium
               cursor-pointer text-brown-500 hover:bg-brown-300"
              >
                <ExternalLink size={18} />
                <span>hh. website</span>
              </div>
            </Link>
            <div
              className="flex items-center gap-3 px-6 py-5 text-b1 font-medium
               cursor-pointer text-brown-500 hover:bg-brown-300"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              <span>Log out</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto h-full">
        {activeTab === "article" && <ArticleManagement />}
        {activeTab === "category" && <CategoryManagement />}
        {activeTab === "profile" && <ProfileManagement />}
        {activeTab === "notification" && <NotificationManagement />}
        {activeTab === "reset-password" && <PasswordManagement />}
      </main>
    </div>
  );
};

export default Dashboard;
