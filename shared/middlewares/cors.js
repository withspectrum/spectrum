// @flow
import cors from 'cors';

export const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
      ? [
          'https://spectrum.chat',
          'https://alpha.spectrum.chat',
          'https://admin.spectrum.chat',
          'https://hyperion.workers.spectrum.chat',
          'https://hyperion.alpha.spectrum.chat',
          process.env.NOW_URL,
        ].filter(Boolean)
      : [/localhost/],
  credentials: true,
};

export default cors(corsOptions);
