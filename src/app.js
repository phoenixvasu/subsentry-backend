import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req, res) => res.json({ ok: true }));

app.use('/api', routes);

// 404 + error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
