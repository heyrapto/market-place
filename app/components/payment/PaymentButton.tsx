"use client";

import { useX402Payment } from '@/app/hooks/useX402Payment';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface PaymentButtonProps {
  endpoint?: string;
  amount?: string;
  description?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function PaymentButton({
  endpoint = '/api/payment',
  amount = '$1.00',
  description = 'Make Payment',
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const { isConnected } = useAccount();
  const { makePayment, isLoading, error, paymentData } = useX402Payment();

  const handlePayment = async () => {
    try {
      const result = await makePayment(endpoint);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      onError?.(errorMessage);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-600">Connect your wallet to make a payment</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`
          px-6 py-3 rounded-lg font-semibold text-white
          ${isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }
          transition-colors duration-200
        `}
      >
        {isLoading ? 'Processing Payment...' : `Pay ${amount} USDC`}
      </button>

      {description && (
        <p className="text-sm text-gray-600 text-center">{description}</p>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Error: {error}</p>
        </div>
      )}

      {paymentData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 font-semibold">Payment Successful!</p>
          <pre className="mt-2 text-xs text-gray-600 overflow-auto">
            {JSON.stringify(paymentData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
