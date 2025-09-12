import React from "react";
import { ResizeHandleProps } from "@/app/types/help";

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown }) => (
  <div
    className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50 group z-10"
    onMouseDown={onMouseDown}
  >
    <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-blue-500/50"></div>
  </div>
);
