import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Pesquisar...", className = "" }) {
  return (
    <div className={`flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md ${className}`}>
      <Search className="w-4 h-4 text-gray-400" />
      <input placeholder={placeholder} className="outline-none text-sm w-full" />
    </div>
  );
}

