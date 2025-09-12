import React from "react";
import { SidebarHeaderProps } from "@/app/types/help";

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  onClose,
  title,
}) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-300">
    <h2 className="text-xl font-semibold">{title}</h2>
    <button
      onClick={onClose}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);
