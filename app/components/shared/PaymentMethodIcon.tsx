import React from "react";
import { CreditCard, Landmark, MailCheck } from "lucide-react";
import { PaymentMethod } from "../../components/ClaimsWalletMax/types";

interface PaymentMethodIconProps {
  method: PaymentMethod;
  className?: string;
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({
  method,
  className = "h-4 w-4",
}) => {
  switch (method) {
    case PaymentMethod.VIRTUAL_CARD:
    case PaymentMethod.DIRECT_CARD:
      return <CreditCard className={className} />;
    case PaymentMethod.ACH:
      return <Landmark className={className} />;
    case PaymentMethod.CHECK:
      return <MailCheck className={className} />;
    default:
      return null;
  }
};

export default PaymentMethodIcon;
