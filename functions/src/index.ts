import { onRequest } from 'firebase-functions/v2/https';

export const placeholder = onRequest((req, res) => {
  res.send('Placeholder function. Replace or remove me!');
});
