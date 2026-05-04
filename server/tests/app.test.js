const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('API Routes exist', () => {
  it('GET /api/products should return a response (not 404)', async () => {
    const res = await request(app).get('/api/products');
    // Route exists — may return 500 without DB, but never 404
    expect(res.statusCode).not.toEqual(404);
  }, 10000);

  it('POST /api/users/register should return a response (not 404)', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123456' });
    // Route exists — may return 500/400 without DB, but never 404
    expect(res.statusCode).not.toEqual(404);
  }, 10000);

  it('POST /api/users/login should return a response (not 404)', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).not.toEqual(404);
  }, 10000);

  it('GET /api/orders should require auth', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(401);
  });
});
