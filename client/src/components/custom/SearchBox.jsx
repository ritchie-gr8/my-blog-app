import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Filter from "./Filter";

const SearchBox = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 py-4 sm:px-6 bg-brown-200 sm:rounded-2xl">
      <Filter style="hidden md:flex" />

      <div className="flex w-full items-center justify-between px-4 py-3 max-h-12 bg-white rounded-[8px] border border-brown-300 md:max-w-[360px]">
        <Input
          placeholder="Search"
          className="p-0 font-medium text-b1 !outline-none !border-none focus:border-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none"
        />
        <Search size={24} strokeWidth={1} className="text-brown-600" />
      </div>

      <p className="font-medium text-brown-400 mt-4 mb-1 md:hidden">Category</p>

      <Select>
        <SelectTrigger
          className="select pl-4 text-brown-400 bg-white font-medium w-full min-h-12 md:hidden"
          style={{
            boxShadow: "none",
            outline: "none",
          }}
        >
          <SelectValue placeholder="Highlight" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchBox;
