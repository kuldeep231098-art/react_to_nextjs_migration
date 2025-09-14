import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

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
import { claimsWalletPlusHelp } from "../../data/pageHelpContent";
import { ClaimsWalletCardPlus } from "../ClaimsWalletCardPlus";
import { PageHelpButton } from "../ui/PageHelpButton";
import ChatBubble from "../ui/ChatBubble";
import { HelpSidebarBase } from "../help/HelpSidebarBase/index";

const validateTransaction = (
  amount: number,
  balance: number,
  t: (key: string) => string
): TransactionValidation => {
  if (isNaN(amount) || amount <= 0) {
    return { isValid: false, error: t("validation.invalidAmount") };
  }
  if (amount > balance) {
    return { isValid: false, error: t("validation.insufficientBalance") };
  }
  return { isValid: true };
};

const createTransaction = (
  amount: number,
  method: PaymentMethod,
  type: TransactionType,
  t: (key: string) => string
): Transaction => {
  const transactionTypeText =
    type === TransactionType.WITHDRAWAL
      ? t("transactions.withdrawal")
      : t("transactions.deposit");

  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    description: `${transactionTypeText} via ${method}`,
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
  const t = useTranslations("claimsWalletMax");
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
      name: t("paymentMethods.virtualCard.name"),
      description: t("paymentMethods.virtualCard.description"),
      icon: CreditCard,
      timeframe: t("paymentMethods.virtualCard.timeframe"),
      priority: 1,
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: "direct-card",
      name: t("paymentMethods.directCard.name"),
      description: t("paymentMethods.directCard.description"),
      icon: CreditCard,
      timeframe: t("paymentMethods.directCard.timeframe"),
      priority: 2,
      color: "from-green-600 to-emerald-600",
    },
    {
      id: "ach",
      name: t("paymentMethods.ach.name"),
      description: t("paymentMethods.ach.description"),
      icon: Landmark,
      timeframe: t("paymentMethods.ach.timeframe"),
      priority: 3,
      color: "from-purple-600 to-violet-600",
    },
    {
      id: "check",
      name: t("paymentMethods.check.name"),
      description: t("paymentMethods.check.description"),
      icon: MailCheck,
      timeframe: t("paymentMethods.check.timeframe"),
      priority: 4,
      color: "from-amber-600 to-orange-600",
    },
  ];

  const toggleHelpSidebar = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setOtpError(t("otp.errors.invalidLength"));
      return;
    }

    if (otp === "123456") {
      setShowOTPModal(false);
      setOtp("");
      setOtpError("");
    } else {
      setOtpError(t("otp.errors.invalidCode"));
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
    const validation = validateTransaction(amount, walletData.balance, t);

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
        TransactionType.WITHDRAWAL,
        t
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
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t("description")}
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
                      <h3 className="text-xl font-bold dark:text-white">
                        {t("paymentMethods.virtualCard.name")}
                      </h3>
                      <div className="ml-auto">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          INSTANT
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {t("paymentMethods.virtualCard.description")}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="font-medium">
                        {t("paymentMethods.virtualCard.select")}
                      </span>
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
                      <h3 className="font-bold dark:text-white">
                        {method.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {method.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {method.timeframe}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 flex items-center text-sm">
                        <span>{t("common.select")}</span>
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
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                {t("transactionTable.title")}
              </h2>{" "}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                        {t("transactionTable.headers.date")}
                      </th>
                      <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                        {t("transactionTable.headers.description")}
                      </th>
                      <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                        {t("transactionTable.headers.amount")}
                      </th>
                      <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                        {t("transactionTable.headers.status")}
                      </th>
                      <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                        {t("transactionTable.headers.method")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!walletData?.transactions?.length ? (
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td
                          colSpan={5}
                          className="py-4 px-4 text-center text-gray-500 dark:text-gray-400"
                        >
                          {t("transactionTable.noTransactions")}
                        </td>
                      </tr>
                    ) : (
                      walletData.transactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="py-4 px-4 text-gray-900 dark:text-gray-100">
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
                              <span className="text-gray-900 dark:text-gray-100">
                                {transaction.description}
                              </span>
                              {transaction.reference && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {t("transactionTable.reference", {
                                    ref: transaction.reference,
                                  })}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={
                                transaction.type === TransactionType.WITHDRAWAL
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
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
                                <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              )}
                              {transaction.method === PaymentMethod.ACH && (
                                <Landmark className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              )}
                              {transaction.method === PaymentMethod.CHECK && (
                                <MailCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              )}
                              <span className="text-gray-900 dark:text-gray-100">
                                {transaction.method}
                              </span>
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
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {t("features.secure.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("features.secure.description")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {t("features.global.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("features.global.description")}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {t("features.realtime.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("features.realtime.description")}
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
                <h3 className="text-xl font-bold dark:text-white">
                  Verify Identity
                </h3>
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
                      <h3 className="text-xl font-bold  dark:text-gray-100">
                        {transferInProgress
                          ? t("transferModal.processing")
                          : t("transferModal.transferTo", {
                              method: modalPaymentMethod,
                            })}
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
                        {t("transferModal.transferringFunds", {
                          method: modalPaymentMethod.toLowerCase(),
                        })}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex items-center">
                        <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t("transferModal.availableBalance")}
                          </div>
                          <div className="text-xl font-bold dark:text-white">
                            ${walletData.balance.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          {t("transferModal.transferAmount")}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            $
                          </span>
                          <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                            min="0.01"
                            max={walletData.balance}
                            step="0.01"
                          />
                        </div>
                      </div>

                      {modalPaymentMethod === paymentMethods[2].name && (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">
                              {t("transferModal.bankDetails.bankName")}
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                              placeholder={t(
                                "transferModal.bankDetails.bankNamePlaceholder"
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 dark:text-white">
                                {t("transferModal.bankDetails.routingNumber")}
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder={t(
                                  "transferModal.bankDetails.routingNumberPlaceholder"
                                )}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 dark:text-white">
                                {t("transferModal.bankDetails.accountNumber")}
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder={t(
                                  "transferModal.bankDetails.accountNumberPlaceholder"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {modalPaymentMethod === paymentMethods[1].name && (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">
                              {t("transferModal.cardDetails.cardNumber")}
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                              placeholder={t(
                                "transferModal.cardDetails.cardNumberPlaceholder"
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 dark:text-white">
                                {t("transferModal.cardDetails.expirationDate")}
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder={t(
                                  "transferModal.cardDetails.expirationDatePlaceholder"
                                )}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 dark:text-white">
                                {t("transferModal.cardDetails.zipCode")}
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder={t(
                                  "transferModal.cardDetails.zipCodePlaceholder"
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {modalPaymentMethod === paymentMethods[3].name && (
                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white">
                              {t("transferModal.mailingAddress")}
                            </label>
                            <textarea
                              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                              placeholder={t(
                                "transferModal.mailingAddressPlaceholder"
                              )}
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
                              ? t(
                                  "transferModal.paymentMethods.virtualCard.timeframe"
                                )
                              : modalPaymentMethod === paymentMethods[1].name
                              ? t(
                                  "transferModal.paymentMethods.directCard.timeframe"
                                )
                              : modalPaymentMethod === paymentMethods[2].name
                              ? t("transferModal.paymentMethods.ach.timeframe")
                              : t(
                                  "transferModal.paymentMethods.check.timeframe"
                                )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>{t("transferModal.secureTransfer")}</span>
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
                        <span>{t("transferModal.transferFunds")}</span>
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
                  <h3 className="text-xl font-bold mb-2 dark:text-white">
                    {t("transferModal.transferSuccess")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t("transferModal.successMessage", {
                      amount: parseFloat(transferAmount).toFixed(2),
                      method: modalPaymentMethod.toLowerCase(),
                    })}
                  </p>
                  <button
                    onClick={() => {
                      setShowTransferModal(false);
                      setTransferSuccess(false);
                      setTransferAmount("");
                    }}
                    className="px-6 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                  >
                    {t("transferModal.close")}
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
