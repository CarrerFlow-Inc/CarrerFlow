import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div className={`bg-gray-200/80 dark:bg-gray-700/40 animate-pulse rounded ${className}`} aria-hidden="true" />
  );
}
