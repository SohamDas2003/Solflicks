"use client";

import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface TicketButtonProps {
  label: string;
  href: string;
  className?: string;
  rightContent?: React.ReactNode;
}

export default function TicketButton({
  label,
  href,
  className = "cursor-pointer",
  rightContent
}: TicketButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`group relative inline-flex h-[36px] lg:h-[48px] items-stretch bg-[#f5f5ea] text-black overflow-hidden ${className}`}
    >
      {/* Main button container */}
      <div className="flex items-center justify-between w-full">
        {/* Left content */}
        <div className="px-3 lg:px-5 py-3 flex-1">
          <span className="font-medium  lg:text-lg">{label}</span>
        </div>

        {/* Center divider with dashed line */}
        <div className="relative h-full border-l border-dashed border-black">
          {/* Top center notch */}
          <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full" />
          
          {/* Bottom center notch */}
          <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full" />
        </div>

        {/* Right content */}
        <div className="px-2 lg:px-3 py-3">
          {rightContent || <span className="text-lg font-extrabold"><MoveRight /></span>}
        </div>
      </div>

      {/* Corner notches - these sit outside the button to create the cutout effect */}
      <div className="absolute -top-[8px] -left-[8px] w-4 h-4 bg-[#121212] rounded-full" />
      <div className="absolute -bottom-[8px] -left-[8px] w-4 h-4 bg-[#121212] rounded-full" />
      <div className="absolute -top-[8px] -right-[8px] w-4 h-4 bg-[#121212] rounded-full" />
      <div className="absolute -bottom-[8px] -right-[8px] w-4 h-4 bg-[#121212] rounded-full" />
    </button>
  );
}