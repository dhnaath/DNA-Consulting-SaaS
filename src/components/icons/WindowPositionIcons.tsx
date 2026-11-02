import type { SVGProps } from "react";

/**
 * Custom-crafted Window Position Icons (Original Design)
 * Crafted specifically for Wira App Shell docking and navigation.
 * Standard 24x24 viewBox with crisp geometric alignment.
 */

// 1. Sidebar Kiri (Window Snap Left with docking arrow indicator)
export function WindowPositionLeftIcon({
  size = 24,
  className = "",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Outer Window Frame */}
      <rect x="3" y="4" width="18" height="16" rx="2" />
      {/* Active Left Docking Area (Filled) */}
      <path
        d="M3 6C3 4.89543 3.89543 4 5 4H10V20H5C3.89543 20 3 19.1046 3 18V6Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Inner Snap Divider */}
      <line x1="10" y1="4" x2="10" y2="20" strokeWidth={1.5} />
      {/* Directional Dock Arrow pointing into left panel */}
      <path
        d="M17 12H13M15 9.5L12.5 12L15 14.5"
        strokeWidth={1.75}
      />
    </svg>
  );
}

// 2. Sidebar Kanan (Window Snap Right with docking arrow indicator)
export function WindowPositionRightIcon({
  size = 24,
  className = "",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Outer Window Frame */}
      <rect x="3" y="4" width="18" height="16" rx="2" />
      {/* Active Right Docking Area (Filled) */}
      <path
        d="M14 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H14V4Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Inner Snap Divider */}
      <line x1="14" y1="4" x2="14" y2="20" strokeWidth={1.5} />
      {/* Directional Dock Arrow pointing into right panel */}
      <path
        d="M7 12H11M9 9.5L11.5 12L9 14.5"
        strokeWidth={1.75}
      />
    </svg>
  );
}

// 3. Panel Atas (Window Snap Top with docking arrow indicator)
export function WindowPositionTopIcon({
  size = 24,
  className = "",
  ...props
}: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Outer Window Frame */}
      <rect x="3" y="4" width="18" height="16" rx="2" />
      {/* Active Top Docking Area (Filled) */}
      <path
        d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10H3V6Z"
        fill="currentColor"
        stroke="none"
      />
      {/* Inner Snap Divider */}
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth={1.5} />
      {/* Directional Dock Arrow pointing up into top panel */}
      <path
        d="M12 17V13M9.5 15L12 12.5L14.5 15"
        strokeWidth={1.75}
      />
    </svg>
  );
}
