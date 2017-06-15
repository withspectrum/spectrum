// @flow
import cors from 'cors';

export default cors({
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://spectrum.chat',
        /spectrum-(\w|-)+\.now\.sh/,
        /(\w|-)+\.spectrum.chat/,
      ]
    : 'http://localhost:3000',
  credentials: true,
});
