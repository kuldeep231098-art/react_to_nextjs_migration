import React from "react";
import { KeyRound, X, ArrowRight } from "lucide-react";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  otp: string;
  onOtpChange: (otp: string) => void;
  otpError: string;
  acceptedTerms: boolean;
  onAcceptTermsChange: (accepted: boolean) => void;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  otp,
  onOtpChange,
  otpError,
  acceptedTerms,
  onAcceptTermsChange,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          For your security, please enter the 6-digit verification code sent to
          your registered phone number.
        </p>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                onOtpChange(value);
              }}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 text-center text-2xl tracking-wider rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-800"
              maxLength={6}
            />
            {otpError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {otpError}
              </p>
            )}
          </div>

          <button
            onClick={onVerify}
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
              onChange={(e) => onAcceptTermsChange(e.target.checked)}
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
  );
};

export default OTPVerificationModal;
