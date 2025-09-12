import React from "react";
import { SidebarContentProps } from "@/app/types/help";

export const SidebarContent: React.FC<SidebarContentProps> = ({ content }) => (
  <div className="p-4 overflow-y-auto flex-1">
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
      <p className="text-gray-600">{content.description}</p>
    </div>

    {content.sections?.map((section, index) => (
      <div key={index} className="mb-6">
        <h4 className="text-md font-semibold mb-2">{section.title}</h4>
        <ul className="space-y-2">
          {section.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <h5 className="font-medium">{item.title}</h5>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    ))}

    {content.features && (
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-2">Key Features</h4>
        <ul className="space-y-2">
          {content.features.map((feature, index) => (
            <li key={index}>
              <h5 className="font-medium">{feature.title}</h5>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
