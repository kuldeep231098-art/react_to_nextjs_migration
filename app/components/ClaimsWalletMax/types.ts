export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
}

export enum TransactionType {
  WITHDRAWAL = "withdrawal",
  DEPOSIT = "deposit",
}

export enum PaymentMethod {
  VIRTUAL_CARD = "Virtual Card",
  DIRECT_CARD = "Direct to Visa/Mastercard",
  ACH = "ACH to Bank",
  CHECK = "eCheck",
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  method: PaymentMethod;
  type: TransactionType;
  reference?: string;
}
