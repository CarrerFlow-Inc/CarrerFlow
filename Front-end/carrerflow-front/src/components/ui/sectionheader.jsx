import React from 'react';

export default function SectionHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="type-body-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
