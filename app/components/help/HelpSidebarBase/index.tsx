import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HelpSidebarProps } from "@/app/types/help";
import { sidebarVariants } from "@/app/constants/help/animations";
import { ResizeHandle } from "../ResizeHandle";
import { SidebarHeader } from "../SidebarHeader";
import { SidebarContent } from "../SidebarContent";
import { SidebarFooter } from "../SidebarFooter";

const MIN_WIDTH = 280;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 400;

export const HelpSidebarBase: React.FC<HelpSidebarProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
          setWidth(newWidth);
        }
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div
      className="fixed top-0 right-0 h-full bg-white shadow-lg flex flex-col z-50"
      style={{ width }}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <ResizeHandle onMouseDown={() => setIsDragging(true)} />
      <SidebarHeader onClose={onClose} title={content.title} />
      <SidebarContent content={content} />
      <SidebarFooter />
    </motion.div>
  );
};
