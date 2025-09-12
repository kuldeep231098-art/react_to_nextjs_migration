import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";

interface HelpItem {
  title: string;
  description: string;
}

interface HelpSection {
  title: string;
  items: HelpItem[];
}

interface PageHelp {
  title: string;
  description: string;
  sections?: HelpSection[];
  features?: HelpItem[];
}

interface HelpSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content: PageHelp;
}

export function HelpSidebarBase({
  isOpen,
  onClose,
  content,
}: HelpSidebarProps) {
  const [width, setWidth] = useState(400); // Default width
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(width);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const minWidth = 300;
  const maxWidth = 600;

  // Handle the start of dragging for resize
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(width);
    e.preventDefault();
  };

  // Handle mouse move during dragging for resize
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = startWidth - (e.clientX - startX);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    },
    [isDragging, startWidth, startX, minWidth, maxWidth]
  );

  // Handle the end of dragging for resize
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners for dragging
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

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  } as const;

  const backdropVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1] as [number, number, number, number],
      },
    },
  } as const;

  const contentVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1] as [number, number, number, number],
      },
    },
  } as const;

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
    closed: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1] as [number, number, number, number],
      },
    },
  } as const;

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
            <div
              ref={resizeHandleRef}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50 group z-10"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-blue-500/50"></div>
            </div>

            <motion.div
              className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
              variants={contentVariants}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Help & Information</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (width > minWidth) setWidth(width - 50);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={width <= minWidth}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    if (width < maxWidth) setWidth(width + 50);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={width >= maxWidth}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            <motion.div
              className="flex-grow overflow-y-auto px-6 py-4"
              variants={contentVariants}
            >
              <motion.div className="mb-6" variants={itemVariants}>
                <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {content.description}
                </p>
              </motion.div>

              {content.sections &&
                content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="mb-8"
                    variants={itemVariants}
                  >
                    <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      {section.title}
                    </h4>
                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                          variants={itemVariants}
                        >
                          <h5 className="font-medium mb-2">{item.title}</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}

              {!content.sections && content.features && (
                <motion.div className="space-y-4" variants={itemVariants}>
                  {content.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                      variants={itemVariants}
                    >
                      <h4 className="font-medium mb-2">{feature.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="p-4 border-t border-gray-200 dark:border-gray-700"
              variants={contentVariants}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need more help? Contact support at{" "}
                <a
                  href="mailto:support@juicefin.com"
                  className="text-blue-600 hover:underline"
                >
                  support@juicefin.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
