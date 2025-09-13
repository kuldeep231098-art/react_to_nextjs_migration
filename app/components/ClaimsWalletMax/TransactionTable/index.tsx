import React from "react";
import { CreditCard, Landmark, MailCheck } from "lucide-react";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
  PaymentMethod,
} from "../types";

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Recent Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                Date
              </th>
              <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                Description
              </th>
              <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                Amount
              </th>
              <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                Status
              </th>
              <th className="text-left py-4 px-4 text-gray-900 dark:text-gray-100">
                Method
              </th>
            </tr>
          </thead>
          <tbody>
            {!transactions?.length ? (
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td
                  colSpan={5}
                  className="py-4 px-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No transactions to display
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="py-4 px-4 text-gray-900 dark:text-gray-100">
                    {new Date(transaction.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </span>
                      {transaction.reference && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Ref: {transaction.reference}
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
                      {Math.abs(transaction.amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === TransactionStatus.COMPLETED
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : transaction.status === TransactionStatus.PENDING
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
                      {transaction.method === PaymentMethod.VIRTUAL_CARD && (
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
  );
};

export default TransactionTable;
