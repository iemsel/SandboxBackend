const axios = require('axios');

const BASE_URL = 'http://localhost:3010';

describe('Auth Service', () => {
  test('should register and login a user', async () => {
    const email = `teacher_${Date.now()}@example.com`;
    const password = 'Secret123!';

    // Register
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      name: 'Test Teacher',
      password,
    });

    expect([200, 201]).toContain(regRes.status);
    expect(regRes.data).toHaveProperty('id');
    expect(regRes.data.email).toBe(email);

    // Login
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.data).toHaveProperty('token');
    expect(loginRes.data).toHaveProperty('user');
    expect(loginRes.data.user.email).toBe(email);
  });
});
