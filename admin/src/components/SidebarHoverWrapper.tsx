"use client";

import { useSidebar } from "./ui/sidebar";
import { useState, useRef } from "react";

export function SidebarHoverWrapper({ children }: { children: React.ReactNode }) {
  const { setOpen, open } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousOpenStateRef = useRef(open);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
    // Save the current state before we change it
    previousOpenStateRef.current = open;
    // Always expand on hover
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Add slight delay before collapsing to prevent flickering
    timeoutRef.current = setTimeout(() => {
      // Only collapse if it was previously closed (not manually opened)
      if (!previousOpenStateRef.current) {
        setOpen(false);
      }
    }, 200);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative transition-all duration-200 ease-in-out"
    >
      {children}
    </div>
  );
}
