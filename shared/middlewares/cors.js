// @flow
import cors from 'cors';

export default cors({
  origin:
    process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
      ? [
          'https://spectrum.chat',
          /spectrum-(\w|-)+\.now\.sh/g,
          /spectrum\.chat$/,
        ]
      : [/localhost/],
  credentials: true,
});
