export interface HelpItem {
  title: string;
  description: string;
}

export interface HelpSection {
  title: string;
  items: HelpItem[];
}

export interface PageHelp {
  title: string;
  description: string;
  sections?: HelpSection[];
  features?: HelpItem[];
}

export interface HelpSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  content: PageHelp;
}

export interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export interface SidebarHeaderProps {
  title: string;
  onClose: () => void;
}

export interface SidebarContentProps {
  content: PageHelp;
}
