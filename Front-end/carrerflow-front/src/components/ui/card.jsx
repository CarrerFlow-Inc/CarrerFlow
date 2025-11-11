import React from "react";

export default function Card({ children, className = "", title, subtitle, action, hoverable = false }) {
  const hoverClasses = hoverable
    ? "transition-all duration-200 will-change-transform hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50"
    : "";

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${hoverClasses} ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900">{title}</h3>}
            {subtitle && <p className="type-caption mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
