export const STRIPE_PRODUCTS = {
  MOVIE_PURCHASE: {
    priceId: 'price_1RQR8nPfquLmpKA5gHzQsa1x',
    name: 'Kupno filmu',
    description: 'Zakup filmu',
    mode: 'payment' as const,
  },
} as const;

export type ProductId = keyof typeof STRIPE_PRODUCTS;