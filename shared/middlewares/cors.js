// @flow
import cors from 'cors';

export default cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://spectrum.chat',
          process.env.NOW_URL || undefined,
          /spectrum\.chat$/,
        ].filter(Boolean)
      : [/localhost/],
  credentials: true,
});
