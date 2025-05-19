import { useState } from 'react';
import { redirectToCheckout } from '../lib/stripe';
import { ProductId } from '../stripe-config';

interface BuyButtonProps {
  productId: ProductId;
  className?: string;
}

export function BuyButton({ productId, className = '' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await redirectToCheckout(productId);
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <i data-lucide="loader-2" className="animate-spin mr-2"></i>
          <span>Przekierowywanie...</span>
        </div>
      ) : (
        <div className="flex items-center">
          <i data-lucide="shopping-cart" className="mr-2"></i>
          <span>Kup teraz</span>
        </div>
      )}
    </button>
  );
}