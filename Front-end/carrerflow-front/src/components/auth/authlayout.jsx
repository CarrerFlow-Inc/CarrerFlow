import React from "react";
import AuthSlider from "./authslider";

// Shared layout for Login and Signup with a left-side slider (visible on md+)
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Slider side */}
      <div className="hidden md:block">
        <div className="h-full">
          {/* Ensure Swiper global styles are available */}
          <AuthSlider />
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {(title || subtitle) && (
              <div className="mb-6 sm:mb-8">
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                )}
                {subtitle && <p className="text-gray-600 mt-2 type-body">{subtitle}</p>}
              </div>
            )}

            {children}

            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
