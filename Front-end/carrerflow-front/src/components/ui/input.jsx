import React from "react";

export default function Input({ label, error, ...props }) {
  const uid = React.useId();
  const inputId = props.id || uid;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block type-subtle mb-2">{label}</label>
      )}
      <input
        {...props}
        id={inputId}
        className={`w-full border rounded-lg px-4 py-3 text-base md:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
