import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

interface ClaimsWalletCardPlusProps {
  balance: number;
  claimNumber?: string;
  onRefresh?: () => void;
  className?: string;
}

export function ClaimsWalletCardPlus({
  balance,
  claimNumber = 'CLM-2024-0078',
  onRefresh = () => {},
  className = ''
}: ClaimsWalletCardPlusProps) {
  return (
    <motion.div 
      className={`bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-7 text-white relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <Wallet className="h-10 w-10" />
          <div>
            <h2 className="text-3xl font-bold">Your Claims Wallet</h2>
            <p className="text-white/80">Claim #{claimNumber}</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-white/80 text-lg mb-2">Available Balance</div>
        <div className="text-6xl font-bold mb-3">${balance.toLocaleString()}</div>
        <div className="text-white/70 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Funds ready for immediate use</span>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.div
          className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ArrowRight className="h-8 w-8" />
        </motion.div>
      </div>
    </motion.div>
  );
}