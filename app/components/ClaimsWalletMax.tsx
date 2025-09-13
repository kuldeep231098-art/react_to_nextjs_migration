import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import ChatBubble from "../components/ChatBubble";
import {
  Shield,
  Clock,
  ArrowRight,
  CreditCard,
  X,
  Globe,
  KeyRound,
  Wallet,
  DollarSign,
  MailCheck,
  Landmark,
  Check,
} from "lucide-react";

enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed",
}

enum TransactionType {
  WITHDRAWAL = "withdrawal",
  DEPOSIT = "deposit",
}

enum PaymentMethod {
  VIRTUAL_CARD = "Virtual Card",
  DIRECT_CARD = "Direct to Visa/Mastercard",
  ACH = "ACH to Bank",
  CHECK = "eCheck",
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
  lastUpdated: string;
  virtualCard?: {
    number: string;
    expiry: string;
    cvv: string;
    balance: number;
  };
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  method: PaymentMethod;
  type: TransactionType;
  reference?: string;
}

interface TransactionValidation {
  isValid: boolean;
  error?: string;
}

const STORAGE_KEYS = {
  WALLET_DATA: "claims-wallet-data",
  VIRTUAL_CARD: "claims-wallet-virtual-card",
};
import { HelpSidebarBase } from "../components/HelpSidebarBase";
import { claimsWalletPlusHelp } from "../data/pageHelpContent";
import { ClaimsWalletCardPlus } from "../components/ClaimsWalletCardPlus";
import { PageHelpButton } from "./ui/PageHelpButton";

const validateTransaction = (
  amount: number,
  balance: number
): TransactionValidation => {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: "Please enter a valid amount" };
  }
  if (amount > balance) {
    return { isValid: false, error: "Insufficient balance" };
  }
  return { isValid: true };
};

const createTransaction = (
  amount: number,
  method: PaymentMethod,
  type: TransactionType
): Transaction => {
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    description: `${
      type === TransactionType.WITHDRAWAL ? "Withdrawal" : "Deposit"
    } via ${method}`,
    amount:
      type === TransactionType.WITHDRAWAL
        ? -Math.abs(amount)
        : Math.abs(amount),
    status: TransactionStatus.PENDING,
    method,
    type,
    reference: Math.random().toString(36).substr(2, 9).toUpperCase(),
  };
};

const getInitialWalletData = (): WalletData => {
  if (typeof window === "undefined") {
    return {
      balance: 4750.0,
      transactions: [],
      lastUpdated: new Date().toISOString(),
      virtualCard: {
        number: "4111 2222 3333 4444",
        expiry: "12/25",
        cvv: "123",
        balance: 0,
      },
    };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.WALLET_DATA);
  if (!stored) {
    const initial: WalletData = {
      balance: 4750.0,
      transactions: [],
      lastUpdated: new Date().toISOString(),
      virtualCard: {
        number: "4111 2222 3333 4444",
        expiry: "12/25",
        cvv: "123",
        balance: 0,
      },
    };
    localStorage.setItem(STORAGE_KEYS.WALLET_DATA, JSON.stringify(initial));
    return initial;
  }

  return JSON.parse(stored);
};

const updateWalletData = (data: Partial<WalletData>): WalletData => {
  const current = getInitialWalletData();
  const updated = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.WALLET_DATA, JSON.stringify(updated));
  return updated;
};

const processTransaction = async (
  walletData: WalletData,
  transaction: Transaction,
  setWalletData: React.Dispatch<React.SetStateAction<WalletData>>
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const updatedTransaction = {
    ...transaction,
    status: TransactionStatus.COMPLETED,
  };
  const updatedData = updateWalletData({
    balance: walletData.balance + transaction.amount,
    transactions: [updatedTransaction, ...walletData.transactions],
  });

  setWalletData(updatedData);
  return true;
};

export function ClaimsWalletMax() {
  const [walletData, setWalletData] =
    useState<WalletData>(getInitialWalletData);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferInProgress, setTransferInProgress] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [modalPaymentMethod, setModalPaymentMethod] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(STORAGE_KEYS.WALLET_DATA);
      if (storedData) {
        setWalletData(JSON.parse(storedData));
      }
    }
  }, []);

  const paymentMethods = [
    {
      id: "virtual-card",
      name: "Virtual Card",
      description: "Instant access to funds with Mastercard",
      icon: CreditCard,
      timeframe: "Instant",
      priority: 1,
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: "direct-card",
      name: "Direct to Visa/Mastercard",
      description: "Send money to your existing credit or debit card",
      icon: CreditCard,
      timeframe: "10-30 minutes",
      priority: 2,
      color: "from-green-600 to-emerald-600",
    },
    {
      id: "ach",
      name: "ACH to Bank",
      description: "Transfer directly to your bank account",
      icon: Landmark,
      timeframe: "1-3 business days",
      priority: 3,
      color: "from-purple-600 to-violet-600",
    },
    {
      id: "check",
      name: "eCheck",
      description: "Traditional check sent to your mailing address",
      icon: MailCheck,
      timeframe: "5-7 business days",
      priority: 4,
      color: "from-amber-600 to-orange-600",
    },
  ];

  const toggleHelpSidebar = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit code");
      return;
    }

    if (otp === "123456") {
      setShowOTPModal(false);
      setOtp("");
      setOtpError("");
    } else {
      setOtpError("Invalid verification code");
    }
  };

  const handleSelectPaymentMethod = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method) {
      setModalPaymentMethod(method.name);
      setShowTransferModal(true);
    }
  };

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    const validation = validateTransaction(amount, walletData.balance);

    if (!validation.isValid) {
      return;
    }

    setTransferInProgress(true);

    try {
      const method =
        Object.values(PaymentMethod).find((m) => m === modalPaymentMethod) ||
        PaymentMethod.VIRTUAL_CARD;
      const newTransaction = createTransaction(
        amount,
        method,
        TransactionType.WITHDRAWAL
      );

      await processTransaction(walletData, newTransaction, setWalletData);

      setTransferSuccess(true);

      setTimeout(() => {
        setShowTransferModal(false);
        setTransferSuccess(false);
        setTransferAmount("");
      }, 2000);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setTransferInProgress(false);
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FF] dark:bg-gray-950">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <div className="mb-8 flex justify-center">
              <Image
                src="/Juice-2024-Logo-2000x800.png"
                alt="Juice Financial"
                width={400}
                height={160}
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Claims Wallet Max
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Access your funds instantly and choose how you want to receive
              your payment. Enhanced features with maximum flexibility.
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-10">
            <ClaimsWalletCardPlus
              balance={walletData.balance}
              onRefresh={() => {
                const refreshedData = getInitialWalletData();
                setWalletData(refreshedData);
              }}
            />
          </div>

          <motion.div
            className="max-w-5xl mx-auto mb-16"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold mb-8 text-center"></h2>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div className="md:col-span-2" variants={cardVariants}>
                <button
                  onClick={() => handleSelectPaymentMethod("virtual-card")}
                  className="w-full bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-600/50 dark:border-blue-500/30 flex md:flex-row flex-col items-center text-left gap-6 relative overflow-hidden group"
                >
                  <div className="w-[200px] h-[120px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex-shrink-0 shadow-lg relative">
                    <div className="absolute top-2 left-2">
                      <Image
                        src="/Juice-2024-Logo-2000x800.png"
                        alt="Juice Financial"
                        width={150}
                        height={60}
                        className="h-6 w-auto"
                      />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Image
                        src="https://www.mastercard.com/content/dam/public/mastercardcom/na/us/en/homepage/Home/mc-logo-52.svg"
                        alt="Mastercard"
                        width={24}
                        height={24}
                        className="h-6 w-auto"
                      />
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/70">
                      **** 4444
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">Virtual Mastercard</h3>
                      <div className="ml-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          INSTANT
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Get instant access to your funds with a virtual Mastercard
                      that can be used anywhere online or added to your mobile
                      wallet.
                    </p>
                    <div className="flex items-center text-blue-600">
                      <span className="font-medium">Select Virtual Card</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Background glow effect on hover */}
                  <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>

              {/* Secondary payment options */}
              {paymentMethods.slice(1).map((method) => (
                <motion.div key={method.id} variants={cardVariants}>
                  <button
                    onClick={() => handleSelectPaymentMethod(method.id)}
                    className="w-full h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 flex flex-col text-left gap-4 relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`p-2 rounded-full bg-${
                          method.id === "direct-card"
                            ? "green"
                            : method.id === "ach"
                            ? "purple"
                            : "amber"
                        }-50 dark:bg-${
                          method.id === "direct-card"
                            ? "green"
                            : method.id === "ach"
                            ? "purple"
                            : "amber"
                        }-900/30 text-${
                          method.id === "direct-card"
                            ? "green"
                            : method.id === "ach"
                            ? "purple"
                            : "amber"
                        }-600 dark:text-${
                          method.id === "direct-card"
                            ? "green"
                            : method.id === "ach"
                            ? "purple"
                            : "amber"
                        }-400`}
                      >
                        <method.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold">{method.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {method.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {method.timeframe}
                      </span>
                      <span className="text-blue-600 flex items-center text-sm">
                        <span>Select</span>
                        <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>

                    {/* Background glow effect on hover */}
                    <div className="absolute inset-0 bg-gray-600/5 dark:bg-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4">Date</th>
                      <th className="text-left py-4 px-4">Description</th>
                      <th className="text-left py-4 px-4">Amount</th>
                      <th className="text-left py-4 px-4">Status</th>
                      <th className="text-left py-4 px-4">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!walletData?.transactions?.length ? (
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td
                          colSpan={5}
                          className="py-4 px-4 text-center text-gray-500"
                        >
                          No transactions to display
                        </td>
                      </tr>
                    ) : (
                      walletData.transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="py-4 px-4">
                            {new Date(transaction.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span>{transaction.description}</span>
                              {transaction.reference && (
                                <span className="text-xs text-gray-500">
                                  Ref: {transaction.reference}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={
                                transaction.type === TransactionType.WITHDRAWAL
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              $
                              {Math.abs(transaction.amount).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.status ===
                                TransactionStatus.COMPLETED
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : transaction.status ===
                                    TransactionStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {transaction.method ===
                                PaymentMethod.VIRTUAL_CARD && (
                                <CreditCard className="h-4 w-4" />
                              )}
                              {transaction.method === PaymentMethod.ACH && (
                                <Landmark className="h-4 w-4" />
                              )}
                              {transaction.method === PaymentMethod.CHECK && (
                                <MailCheck className="h-4 w-4" />
                              )}
                              <span>{transaction.method}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Additional Features & Cards */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Bank-grade security protecting your virtual card details
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Global Acceptance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use your virtual card anywhere Mastercard is accepted
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track transactions and balance updates instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed top-20 right-4 z-40">
        <PageHelpButton onClick={toggleHelpSidebar} isOpen={isHelpOpen} />
      </div>

      <HelpSidebarBase
        isOpen={isHelpOpen}
        onClose={toggleHelpSidebar}
        content={claimsWalletPlusHelp}
      />

      <ChatBubble />

      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <KeyRound className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold">Verify Identity</h3>
              </div>
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              For your security, please enter the 6-digit verification code sent
              to your registered phone number.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(value);
                    setOtpError("");
                  }}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-2 text-center text-2xl tracking-wider rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  maxLength={6}
                />
                {otpError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {otpError}
                  </p>
                )}
              </div>

              <button
                onClick={handleVerifyOTP}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                disabled={!acceptedTerms}
                style={{
                  opacity: acceptedTerms ? 1 : 0.5,
                  cursor: acceptedTerms ? "pointer" : "not-allowed",
                }}
              >
                Verify Code
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Resend Code
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label htmlFor="terms">
                  I accept the{" "}
                  <a
                    href="https://juicefin.com/wp-content/uploads/2024/10/CLL-09272024-001.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Cardholder Terms & Conditions
                  </a>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showTransferModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!transferInProgress && !transferSuccess) {
                setShowTransferModal(false);
                setTransferAmount("");
              }
            }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!transferSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-bold">
                        {transferInProgress
                          ? "Processing..."
                          : `Transfer to ${modalPaymentMethod}`}
                      </h3>
                    </div>
                    {!transferInProgress && (
                      <button
                        onClick={() => {
                          setShowTransferModal(false);
                          setTransferAmount("");
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    )}
                  </div>

                  {transferInProgress ? (
                    <div className="py-10 flex flex-col items-center justify-center">
                      <div className="mb-6">
                        <motion.div
                          className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                      <p className="text-center text-gray-600 dark:text-gray-400">
                        Transferring funds to your{" "}
                        {modalPaymentMethod.toLowerCase()}...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex items-center">
                        <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Available Balance
                          </div>
                          <div className="text-xl font-bold">
                            ${walletData.balance.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Transfer Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xl"
                            min="0.01"
                            max={walletData.balance}
                            step="0.01"
                          />
                        </div>
                      </div>

                      {modalPaymentMethod === paymentMethods[2].name && (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                              placeholder="Enter bank name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Routing Number
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                                placeholder="9 digits"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Account Number
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                                placeholder="Account number"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {modalPaymentMethod === paymentMethods[1].name && (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                              placeholder="Card number"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Expiration Date
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Zip Code
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                                placeholder="Billing zip code"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {modalPaymentMethod === paymentMethods[3].name && (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Mailing Address
                            </label>
                            <textarea
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
                              placeholder="Enter your mailing address"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {modalPaymentMethod === paymentMethods[0].name
                              ? "Available immediately"
                              : modalPaymentMethod === paymentMethods[1].name
                              ? "Typically takes 10-30 minutes"
                              : modalPaymentMethod === paymentMethods[2].name
                              ? "Processing time: 1-3 business days"
                              : "Delivery time: 5-7 business days"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Secure, encrypted transfer</span>
                        </div>
                      </div>

                      <button
                        onClick={handleTransfer}
                        disabled={
                          !transferAmount ||
                          parseFloat(transferAmount) <= 0 ||
                          parseFloat(transferAmount) > walletData.balance
                        }
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all 
                          ${
                            !transferAmount ||
                            parseFloat(transferAmount) <= 0 ||
                            parseFloat(transferAmount) > walletData.balance
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                          }`}
                      >
                        <span>Transfer Funds</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Transfer Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    ${parseFloat(transferAmount).toFixed(2)} has been sent to
                    your {modalPaymentMethod.toLowerCase()}.
                  </p>
                  <button
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferSuccess(false);
                      setTransferAmount("");
                    }}
                    className="px-6 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
