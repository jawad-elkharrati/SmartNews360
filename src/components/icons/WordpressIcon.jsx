import React from 'react';

export default function WordpressIcon({ size = 16, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 7h1.8l2.2 6.2L14.2 7h1.8l-3.4 9h-1.2L8 7z" fill="currentColor" />
    </svg>
  );
}
