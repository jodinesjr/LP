// Initialize Vercel Analytics
import { inject } from '@vercel/analytics';

// Only run in production
if (process.env.NODE_ENV === 'production') {
  inject();
}
