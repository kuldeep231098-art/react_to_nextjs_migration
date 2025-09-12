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
  sections: HelpSection[];
}

export const claimsWalletPlusHelp: PageHelp = {
  title: "Claims Wallet Plus Help",
  description:
    "Claims Wallet Plus offers enhanced features including a virtual Mastercard and mobile wallet integration for your claim funds.",
  sections: [
    {
      title: "Enhanced Features",
      items: [
        {
          title: "Virtual Mastercard",
          description:
            "Access a virtual Mastercard that can be used for online and in-store purchases wherever Mastercard is accepted.",
        },
        {
          title: "Mobile Wallet Integration",
          description:
            "Add your virtual card to Apple Pay, Google Pay, or Samsung Pay for contactless payments.",
        },
        {
          title: "Transaction History",
          description:
            "View detailed history of all transactions made with your virtual card.",
        },
        {
          title: "Security Controls",
          description:
            "Manage card security settings including locking your card and setting purchase limits.",
        },
      ],
    },
    {
      title: "Activation & Setup",
      items: [
        {
          title: "Card Activation",
          description:
            "Your card requires verification via a secure one-time password (OTP) sent to your registered phone number.",
        },
        {
          title: "Adding to Mobile Wallet",
          description:
            "After activation, use the 'Add to Mobile Wallet' options to add your card to your preferred mobile payment app.",
        },
        {
          title: "Terms & Conditions",
          description:
            "Review and accept the cardholder terms and conditions before using your virtual card.",
        },
      ],
    },
  ],
};
