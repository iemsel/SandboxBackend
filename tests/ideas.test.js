const axios = require("axios");

const BASE_URL = "http://localhost:3010";

async function createTestUserAndToken() {
  const email = `ideas_${Date.now()}@example.com`;
  const password = "Secret123!";

  await axios.post(`${BASE_URL}/auth/register`, {
    email,
    name: "Ideas Tester",
    password,
  });

  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });

  return loginRes.data.token;
}

describe("Ideas Service", () => {
  let token;

  beforeAll(async () => {
    token = await createTestUserAndToken();
  });

  test("should create an idea and list it", async () => {
    // Create idea
    const createRes = await axios.post(
      `${BASE_URL}/ideas`,
      {
        title: "Puddle explorers",
        description: "Kids map puddles after rain.",
        time_minutes: 30,
        difficulty: "easy",
        materials: "chalk, clipboards",
        subject: "nature",
        season: "autumn",
        yard_context: "no_green",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   expect([200, 201]).toContain(createRes.status);
    expect(createRes.data).toHaveProperty("id");
    const ideaId = createRes.data.id;

    // Mark favourite
    const favRes = await axios.post(
      `${BASE_URL}/ideas/favorites/${ideaId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(favRes.status === 200 || favRes.status === 204).toBe(true);

    // Get favorites_only
    const listRes = await axios.get(
      `${BASE_URL}/ideas?favorites_only=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.data)).toBe(true);
    const found = listRes.data.find((i) => i.id === ideaId);
    expect(found).toBeDefined();
  });
});
