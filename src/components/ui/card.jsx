// Generic Card components (lightweight placeholder)
import React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return <h3 className={`text-lg font-semibold leading-tight ${className}`}>{children}</h3>;
}

export function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}