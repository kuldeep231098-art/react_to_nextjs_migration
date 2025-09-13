import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpSidebarProps } from "@/app/types/help";
import {
  backdropVariants,
  SIDEBAR_DIMENSIONS,
  sidebarVariants,
} from "@/app/constants/help/animations";
import { ResizeHandle } from "../ResizeHandle";
import { SidebarHeader } from "../SidebarHeader";
import { SidebarContent } from "../SidebarContent";
import { SidebarFooter } from "../SidebarFooter";

export function HelpSidebarBase({
  isOpen,
  onClose,
  content,
}: HelpSidebarProps) {
  const [width, setWidth] = useState<number>(SIDEBAR_DIMENSIONS.DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(width);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(width);
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = startWidth - (e.clientX - startX);
      if (
        newWidth >= SIDEBAR_DIMENSIONS.MIN_WIDTH &&
        newWidth <= SIDEBAR_DIMENSIONS.MAX_WIDTH
      ) {
        setWidth(newWidth);
      }
    },
    [isDragging, startWidth, startX]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) return;

      const target = e.target as Element;

      if (target.closest(".help-toggle-button")) {
        return;
      }

      if (sidebarRef.current && !sidebarRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            key="backdrop"
          />

          <motion.div
            ref={sidebarRef}
            className="fixed top-5 right-5 bottom-5 rounded-lg bg-white dark:bg-gray-900 shadow-xl flex flex-col overflow-hidden origin-top-right z-50"
            style={{ width: `${width}px` }}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            key="sidebar"
          >
            <ResizeHandle onMouseDown={handleMouseDown} />
            <SidebarHeader onClose={onClose} />
            <SidebarContent content={content} />
            <SidebarFooter />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
