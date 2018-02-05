// @flow
import cors from 'cors';

// Only these domains can query the API
export default cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          // Main site
          'https://spectrum.chat',
          // Deployment URL
          process.env.NOW_URL || undefined,
          // Any spectrum.chat subdomain
          /\.spectrum\.chat$/,
        ].filter(Boolean)
      : [/localhost/],
  credentials: true,
});
