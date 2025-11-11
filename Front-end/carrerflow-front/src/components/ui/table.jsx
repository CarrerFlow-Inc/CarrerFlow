import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-x-auto ${className}`}>
      <table className="w-full text-sm divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-gray-50 text-gray-600">
      {children}
    </thead>
  );
}

export function TBody({ children }) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {children}
    </tbody>
  );
}

export function TRow({ children, hover = true }) {
  return (
    <tr className={`${hover ? 'hover:bg-gray-50' : ''}`}>
      {children}
    </tr>
  );
}

export function THeadCell({ children, align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th className={`px-4 py-3 font-medium ${alignClass}`}>{children}</th>
  );
}

export function TCell({ children, align = 'left', colSpan }) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <td className={`px-4 py-3 ${alignClass}`} colSpan={colSpan}>{children}</td>
  );
}

export default { Table, THead, TBody, TRow, THeadCell, TCell };
