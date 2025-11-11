import React from 'react';

export default function FormField({ label, children, error, hint, htmlFor, className = '' }) {
  const autoId = React.useId();
  const id = htmlFor || autoId;
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block type-subtle">{label}</label>
      )}
      {React.isValidElement(children) ? React.cloneElement(children, { id }) : children}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
