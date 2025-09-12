declare module "@n8n/chat" {
  interface ChatOptions {
    webhookUrl: string;
    mode: "window";
    showWelcomeScreen: boolean;
    initialMessages: string[];
    i18n: {
      [key: string]: {
        title: string;
        subtitle: string;
        inputPlaceholder: string;
        getStarted: string;
        footer: string;
        closeButtonTooltip: string;
      };
    };
  }

  export function createChat(options: Partial<ChatOptions>): void;
}
