import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { getPool } from '../config/db.js';
import authRoutes from '../modules/auth/auth.route.js';

// Mock the database pool
jest.mock('../config/db.js', () => ({
  getPool: jest.fn(() => ({
    connect: jest.fn(() => ({
      query: jest.fn(),
      release: jest.fn(),
    })),
  })),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Set up JWT secret for tests
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

describe('Auth Routes', () => {
  let pool;
  let client;

  beforeEach(() => {
    pool = getPool();
    client = pool.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201', async () => {
      client.query.mockResolvedValueOnce({ rows: [{ id: 1, username: 'testuser' }] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.data.username).toBe('testuser');
    });

    it('should return 409 if username already exists', async () => {
      client.query.mockRejectedValueOnce({ code: '23505' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user and return a token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      client.query.mockResolvedValueOnce({ rows: [{ id: 1, username: 'testuser', password: hashedPassword }] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      client.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wronguser', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toBe('Invalid username or password');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 with a valid token', async () => {
        const token = jwt.sign({ sub: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Welcome user 1');
    });
  });
});
