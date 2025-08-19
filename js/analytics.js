// Initialize Vercel Analytics
import { inject } from '@vercel/analytics';

// Only run in production
if (import.meta.env.PROD) {
  inject({
    // Optional configuration
    mode: 'production'
  });
}
