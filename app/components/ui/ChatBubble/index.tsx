"use client";

import "@n8n/chat/style.css";
import "../../styles/n8n-chat-custom.css";
import { ChatBubbleIcon } from "../ChatBubbleIcon";

export default function ChatBubble() {
  return (
    <div id="n8n-chat" className="fixed bottom-6 right-6 z-50">
      <div className="chat-button-wrapper" aria-label="Chat button visual">
        <ChatBubbleIcon />
      </div>
    </div>
  );
}
