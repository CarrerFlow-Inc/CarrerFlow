import React from 'react';

export default function SectionHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="type-body-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
