import {
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  Home,
  Wallet,
} from "lucide-react";

export const createPaymentSolutionsCategories = (
  t: (key: string) => string
) => [
  {
    title: t("navigation.paymentSolutions.categories.incoming.title"),
    description: t(
      "navigation.paymentSolutions.categories.incoming.description"
    ),
    items: [
      {
        title: t(
          "navigation.paymentSolutions.items.incomingPaymentsSummary.title"
        ),
        description: t(
          "navigation.paymentSolutions.items.incomingPaymentsSummary.description"
        ),
        icon: DollarSign,
        href: "/incoming-payments",
        divider: true,
        isSummary: true,
      },
      {
        title: t("navigation.paymentSolutions.items.premiumPayAgent.title"),
        description: t(
          "navigation.paymentSolutions.items.premiumPayAgent.description"
        ),
        icon: CreditCard,
        href: "/premium-pay-agent",
      },
      {
        title: t("navigation.paymentSolutions.items.premiumPayClient.title"),
        description: t(
          "navigation.paymentSolutions.items.premiumPayClient.description"
        ),
        icon: CreditCard,
        href: "/premium-pay-client",
      },
      {
        title: t("navigation.paymentSolutions.items.policyHub.title"),
        description: t(
          "navigation.paymentSolutions.items.policyHub.description"
        ),
        icon: FileText,
        href: "/policy-hub",
      },
    ],
  },
  {
    title: t("navigation.paymentSolutions.categories.outgoing.title"),
    description: t(
      "navigation.paymentSolutions.categories.outgoing.description"
    ),
    items: [
      {
        title: t(
          "navigation.paymentSolutions.items.outgoingPaymentsSummary.title"
        ),
        description: t(
          "navigation.paymentSolutions.items.outgoingPaymentsSummary.description"
        ),
        icon: DollarSign,
        href: "/outgoing-payments",
        divider: true,
        isSummary: true,
      },
      {
        title: t("navigation.paymentSolutions.items.payLink.title"),
        description: t("navigation.paymentSolutions.items.payLink.description"),
        icon: FileText,
        href: "/pay-link",
      },
      {
        title: t("navigation.paymentSolutions.items.payPartners.title"),
        description: t(
          "navigation.paymentSolutions.items.payPartners.description"
        ),
        icon: Building2,
        href: "/pay-partners",
      },
      {
        title: t("navigation.paymentSolutions.items.payClaims.title"),
        description: t(
          "navigation.paymentSolutions.items.payClaims.description"
        ),
        icon: CreditCard,
        href: "/claim-payment-lander",
      },
    ],
  },
  {
    title: t("navigation.paymentSolutions.categories.domestic.title"),
    description: t(
      "navigation.paymentSolutions.categories.domestic.description"
    ),
    items: [
      {
        title: t(
          "navigation.paymentSolutions.items.domesticPaymentsSummary.title"
        ),
        description: t(
          "navigation.paymentSolutions.items.domesticPaymentsSummary.description"
        ),
        icon: Home,
        href: "/domestic-payments",
        isSummary: true,
      },
      {
        title: t(
          "navigation.paymentSolutions.items.internationalPaymentsSummary.title"
        ),
        description: t(
          "navigation.paymentSolutions.items.internationalPaymentsSummary.description"
        ),
        icon: Globe,
        href: "/international-payments",
        divider: true,
        isSummary: true,
      },
      {
        title: t("navigation.paymentSolutions.items.virtualClaimsCard.title"),
        description: t(
          "navigation.paymentSolutions.items.virtualClaimsCard.description"
        ),
        icon: CreditCard,
        href: "/virtual-claims-card",
      },
      {
        title: t(
          "navigation.paymentSolutions.items.claimsWalletSolutions.title"
        ),
        description: t(
          "navigation.paymentSolutions.items.claimsWalletSolutions.description"
        ),
        icon: Wallet,
        href: "/claims-wallet",
      },
    ],
  },
];

// Keep the original export for backwards compatibility
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
