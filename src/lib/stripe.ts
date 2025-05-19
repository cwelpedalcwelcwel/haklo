import { STRIPE_PRODUCTS } from '../stripe-config';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  const { origin } = window.location;
  const success_url = `${origin}/success`;
  const cancel_url = `${origin}/cancel`;

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      success_url,
      cancel_url,
      mode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const { url } = await response.json();
  return url;
}

export async function redirectToCheckout(productId: keyof typeof STRIPE_PRODUCTS) {
  const product = STRIPE_PRODUCTS[productId];
  const checkoutUrl = await createCheckoutSession(product.priceId, product.mode);
  window.location.href = checkoutUrl;
}