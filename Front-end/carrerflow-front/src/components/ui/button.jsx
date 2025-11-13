import React, { useRef, useState } from "react";
import Spinner from "./spinner";

export default function Button({ children, variant = "primary", className = "", loading = false, disabled = false, ripple = true, ...props }) {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50",
    charcoal: "bg-gray-900 hover:bg-gray-800 text-white shadow-md shadow-black/20",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  const btnRef = useRef(null);
  const [ripples, setRipples] = useState([]);

  function handleClick(e) {
    if (ripple && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const newRipple = { id: Date.now(), x, y, size, active: false };
      setRipples((prev) => [...prev, newRipple]);
      requestAnimationFrame(() => {
        setRipples((prev) => prev.map(r => r.id === newRipple.id ? { ...r, active: true } : r));
      });
      setTimeout(() => {
        setRipples((prev) => prev.filter(r => r.id !== newRipple.id));
      }, 300);
    }
    if (props.onClick) props.onClick(e);
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      ref={btnRef}
      disabled={disabled || loading}
      className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium text-base md:text-sm min-h-11 transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <Spinner size={18} />
        </span>
      )}
      <span className={`${loading ? 'opacity-60' : 'opacity-100'} flex items-center gap-2`}>
        {children}
      </span>
      <span className="absolute inset-0 pointer-events-none">
        {ripples.map(r => (
          <span
            key={r.id}
            style={{ left: r.x, top: r.y, width: r.size, height: r.size, transform: r.active ? 'scale(2.5)' : 'scale(0)', opacity: r.active ? 0 : 0.6, transition: 'transform 300ms ease-out, opacity 300ms ease-out' }}
            className="absolute rounded-full bg-white/30 dark:bg-white/20"
          />
        ))}
      </span>
    </button>
  );
}
