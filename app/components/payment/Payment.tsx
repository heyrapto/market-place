// components/PaymentButton.tsx
'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';

export function PaymentButton() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payment');
      
      if (response.status === 402) {
        // Payment required - get payment instructions
        const paymentData = await response.json();
        console.log('Payment instructions:', paymentData);
        
        // The x402 middleware handles the payment flow
        // User will need to complete the USDC payment
        setResult(paymentData);
      } else if (response.ok) {
        // Payment was successful
        const data = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={!isConnected || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay $1 USDC'}
      </button>
      
      {result && (
        <div className="p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}