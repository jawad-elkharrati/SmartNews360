import React from "react";

export function ComposableMap({ children, ...props }) {
  return <svg viewBox="0 0 400 220" {...props}>{children}</svg>;
}

export function Geographies({ children, geography }) {
  // Minimal set of ISO-3 codes used in the dashboard
  const codes = ["MAR", "NGA", "EGY", "ZAF", "KEN"];
  const geographies = codes.map(code => ({
    rsmKey: code,
    properties: { ISO_A3: code }
  }));
  return <g>{typeof children === "function" ? children({ geographies }) : children}</g>;
}

export function Geography({ geography, fill = "#ccc", stroke = "#fff", strokeWidth = 0.5, ...rest }) {
  return (
    <rect
      x="0"
      y="0"
      width="0"
      height="0"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
}