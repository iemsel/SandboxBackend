const axios = require('axios');

const BASE_URL = 'http://localhost:3010';

async function createTestUserAndToken() {
  const email = `planner_${Date.now()}@example.com`;
  const password = 'Secret123!';

  await axios.post(`${BASE_URL}/auth/register`, {
    email,
    name: 'Planner Tester',
    password,
  });

  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });

  return loginRes.data.token;
}

async function createIdea(token) {
  try {
    const res = await axios.post(
      `${BASE_URL}/ideas`,
      {
        // Use values we already know are valid (same as ideas.test.js)
        title: 'Puddle explorers (planner)',
        description: 'Kids map puddles after rain and talk about runoff.',
        time_minutes: 30,
        difficulty: 'easy',
        materials: 'chalk, clipboards',
        subject: 'nature',
        season: 'autumn',
        yard_context: 'no_green',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (![200, 201].includes(res.status)) {
      throw new Error(`Unexpected status: ${res.status}`);
    }

    return res.data.id;
  } catch (err) {
    console.error(
      'Error creating idea in planner.test:',
      err.response?.status,
      err.response?.data || err.message,
    );
    throw err;
  }
}

describe('Planner Service', () => {
  let token;
  let ideaId;

  beforeAll(async () => {
    token = await createTestUserAndToken();
    ideaId = await createIdea(token);
  });

  test('should create a plan, add an item and fetch it with items', async () => {
    // Create plan
    const planRes = await axios.post(
      `${BASE_URL}/planner/plans`,
      {
        title: 'Friday outdoor block',
        date: '2025-11-28',
        class_name: 'Group 6',
        notes: 'Focus on movement + nature observation',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    expect([200, 201]).toContain(planRes.status);
    const planId = planRes.data.id;

    // Add plan item
    const itemRes = await axios.post(
      `${BASE_URL}/planner/plans/${planId}/items`,
      {
        idea_id: ideaId,
        start_time: '10:30:00',
        end_time: '11:10:00',
        location: 'Schoolyard',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    expect([200, 201]).toContain(planRes.status);
    expect(itemRes.data).toHaveProperty('id');

    // Get full plan
    const getRes = await axios.get(`${BASE_URL}/planner/plans/${planId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect([200, 201]).toContain(planRes.status);
    expect(getRes.data).toHaveProperty('items');
    expect(Array.isArray(getRes.data.items)).toBe(true);
    expect(getRes.data.items.length).toBeGreaterThan(0);
  });
});
