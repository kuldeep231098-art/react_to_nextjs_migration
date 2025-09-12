import {
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  Home,
  Wallet,
} from "lucide-react";

export const paymentSolutionsCategories = [
  {
    title: "Incoming Payments",
    description:
      "Solutions for processing premium payments and policy purchases",
    items: [
      {
        title: "Incoming Payments Summary",
        description: "Overview of our incoming payment solutions",
        icon: DollarSign,
        href: "/incoming-payments",
        divider: true,
        isSummary: true,
      },
      {
        title: "Premium Pay - Agent",
        description: "Process premium payments for insurance agents",
        icon: CreditCard,
        href: "/premium-pay-agent",
      },
      {
        title: "Premium Pay - Client",
        description: "Pay your insurance premium securely and conveniently",
        icon: CreditCard,
        href: "/premium-pay-client",
      },
      {
        title: "Policy Hub",
        description: "Access and manage your policy details and documents",
        icon: FileText,
        href: "/policy-hub",
      },
    ],
  },
  {
    title: "Outgoing Payments",
    description: "Solutions for processing claims and beneficiary payments",
    items: [
      {
        title: "Outgoing Payments Summary",
        description: "Overview of our outgoing payment solutions",
        icon: DollarSign,
        href: "/outgoing-payments",
        divider: true,
        isSummary: true,
      },
      {
        title: "Pay Link",
        description: "Create a one-time payment link with customizable options",
        icon: FileText,
        href: "/pay-link",
      },
      {
        title: "Pay Partners",
        description:
          "Process payments to partners, agents, and service providers",
        icon: Building2,
        href: "/pay-partners",
      },
      {
        title: "Pay Claims",
        description: "Pay claims instantly with flexible payment methods",
        icon: CreditCard,
        href: "/claim-payment-lander",
      },
    ],
  },
  {
    title: "Domestic & International",
    description: "Solutions for processing payments domestically and globally",
    items: [
      {
        title: "Domestic Payments Summary",
        description: "Payment solutions for the United States",
        icon: Home,
        href: "/domestic-payments",
        isSummary: true,
      },
      {
        title: "International Payments Summary",
        description: "Global payment solutions for cross-border transactions",
        icon: Globe,
        href: "/international-payments",
        divider: true,
        isSummary: true,
      },
      {
        title: "Virtual Claims Card",
        description: "Issue instant virtual cards for claims payments",
        icon: CreditCard,
        href: "/virtual-claims-card",
      },
      {
        title: "Claims Wallet Solutions",
        description: "Digital wallet solutions for managing claim funds",
        icon: Wallet,
        href: "/claims-wallet",
      },
    ],
  },
];
