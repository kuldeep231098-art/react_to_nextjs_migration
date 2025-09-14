import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Wallet,
  DollarSign,
  ArrowRight,
  X,
  Check,
  Clock,
  Shield,
} from "lucide-react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number) => Promise<void>;
  paymentMethod: string;
  walletBalance: number;
  transferInProgress: boolean;
  transferSuccess: boolean;
  transferAmount: string;
  onTransferAmountChange: (amount: string) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  paymentMethod,
  walletBalance,
  transferInProgress,
  transferSuccess,
  transferAmount,
  onTransferAmountChange,
}) => {
  const t = useTranslations("claimsWalletMax.transferModal");

  const paymentMethods = [
    {
      id: "virtual-card",
      name: t("paymentMethods.virtualCard.name"),
      timeframe: t("paymentMethods.virtualCard.timeframe"),
    },
    {
      id: "direct-card",
      name: t("paymentMethods.directCard.name"),
      timeframe: t("paymentMethods.directCard.timeframe"),
    },
    {
      id: "ach",
      name: t("paymentMethods.ach.name"),
      timeframe: t("paymentMethods.ach.timeframe"),
    },
    {
      id: "check",
      name: t("paymentMethods.check.name"),
      timeframe: t("paymentMethods.check.timeframe"),
    },
  ];

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!isNaN(amount) && amount > 0 && amount <= walletBalance) {
      onTransfer(amount);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={!transferInProgress && !transferSuccess ? onClose : undefined}
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
                <h3 className="text-xl font-bold dark:text-gray-100">
                  {transferInProgress
                    ? t("processing")
                    : t("transferTo", { method: paymentMethod })}
                </h3>
              </div>
              {!transferInProgress && (
                <button
                  onClick={onClose}
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
                  {t("transferringFunds", {
                    method: paymentMethod.toLowerCase(),
                  })}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex items-center">
                  <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t("availableBalance")}
                    </div>
                    <div className="text-xl font-bold dark:text-white">
                      ${walletBalance.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 dark:text-white">
                    {t("transferAmount")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => onTransferAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                      min="0.01"
                      max={walletBalance}
                      step="0.01"
                    />
                  </div>
                </div>

                {paymentMethod === paymentMethods[2].name && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Routing Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                          placeholder="9 digits"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Account Number
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                          placeholder="Account number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === paymentMethods[1].name && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Card number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 dark:text-white">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
                          placeholder="Billing zip code"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === paymentMethods[3].name && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-white">
                        Mailing Address
                      </label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
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
                      {
                        paymentMethods.find((m) => m.name === paymentMethod)
                          ?.timeframe
                      }
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
                    parseFloat(transferAmount) > walletBalance
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all 
                    ${
                      !transferAmount ||
                      parseFloat(transferAmount) <= 0 ||
                      parseFloat(transferAmount) > walletBalance
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
            <h3 className="text-xl font-bold mb-2 dark:text-white">
              Transfer Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ${parseFloat(transferAmount).toFixed(2)} has been sent to your{" "}
              {paymentMethod.toLowerCase()}.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TransferModal;
