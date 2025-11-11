import React from "react";

export default function Badge({ children, variant = "default", className = "", tone = null }) {
  const variants = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    primary: "bg-indigo-100 text-indigo-700 border-indigo-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200"
  };

  if (tone) {
    const { background, text, border } = tone;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
        style={{
          backgroundColor: background,
          color: text,
          borderColor: border,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
