import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import errorHandler from './app/middlewares/errorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import morgan from 'morgan';
import { clerkMiddleware } from '@clerk/express';
import { config } from './config/env';
const app = express();

app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  clerkMiddleware({
    publishableKey: config.CLERK_PUBLISHABLE_KEY,
    secretKey: config.CLERK_SECRET_KEY,
  })
);

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API',
    status: 'success',
    data: {
      name: 'API',
      version: '1.0.0',
      description: 'A simple Backend API with TypeScript and Express',
    },
  });
});
app.use('/api/v1', router);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
