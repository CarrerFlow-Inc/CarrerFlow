import React from "react";

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, highlight = false, onClick }) {
  const iconBase = highlight ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700 group-hover:bg-white/10 group-hover:text-white";
  const isClickable = typeof onClick === "function";

  const baseBg = highlight ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const hoverBg = highlight ? "hover:bg-gray-800/95" : "hover:bg-gray-900 hover:text-white hover:border-gray-900";
  const border = highlight ? "border-gray-900" : "border-gray-100";

  return (
    <div
      className={`group ${baseBg} rounded-2xl border ${border} p-6 shadow-sm transition-all duration-200 will-change-transform hover:shadow-md hover:-translate-y-0.5 ${hoverBg} ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={`${highlight ? "text-gray-300" : "text-gray-500 group-hover:text-gray-300"} type-body-sm font-medium`}>{title}</p>
          <p className={`text-3xl md:text-4xl font-semibold mt-1.5 ${highlight ? "text-white" : "text-gray-900 group-hover:text-white"}`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`type-caption font-medium ${trend === 'up' 
                ? (highlight ? '!text-emerald-300' : '!text-emerald-600 group-hover:!text-emerald-300') 
                : (highlight ? '!text-rose-300' : '!text-rose-500 group-hover:!text-rose-300')}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className={`type-caption ${highlight ? '!text-emerald-300' : '!text-emerald-600 group-hover:!text-emerald-300'}`}>vs mês anterior</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBase}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
