import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
dotenv.config();

import app from "./app.js";
import { connectDb } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const PORT = process.env.PORT || 4000;

// Add security and logging middleware
app.use(helmet());
app.use(morgan("combined"));

// Add error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

(async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`SubSentry API listening on port ${PORT}`);
  });
})();
