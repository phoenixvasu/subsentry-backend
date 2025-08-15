import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDb } from './config/db.js';

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`SubSentry API listening on port ${PORT}`);
  });
})();
