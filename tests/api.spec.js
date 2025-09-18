// tests/api.spec.js
import { test, expect } from "@playwright/test";

test.describe("Next.js (App Router) API - Companies", () => {
  // 1. /companies/count
  test("GET /api/companies/count - returns total", async ({ request }) => {
    const res = await request.get("/api/companies/count");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("total");
    expect(typeof body.total).toBe("number");
  });

  test("GET /api/companies/count - filter by name", async ({ request }) => {
    const res = await request.get("/api/companies/count?name=Microsoft");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("total");
    expect(body.total).toBeGreaterThanOrEqual(0);
  });

  test("GET /api/companies/count - non-existing company", async ({
    request,
  }) => {
    const res = await request.get("/api/companies/count?name=DoesNotExistXYZ");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.total).toBe(0);
  });

  // 2. /companies/top-paid
  test("GET /api/companies/top-paid - default limit 5", async ({ request }) => {
    const res = await request.get("/api/companies/top-paid");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeLessThanOrEqual(5);
  });

  test("GET /api/companies/top-paid - sorted descending", async ({
    request,
  }) => {
    const res = await request.get("/api/companies/top-paid?limit=10");
    expect(res.status()).toBe(200);
    const body = await res.json();

    // Make sure baseSalary exists and is a number
    const salaries = body.map((c) => Number(c.baseSalary || 0));

    for (let i = 0; i < salaries.length - 1; i++) {
      expect(salaries[i]).toBeGreaterThanOrEqual(salaries[i + 1]);
    }
  });

  // 3. /companies/by-skill/:skill
  test("GET /api/companies/by-skill/DSA - returns companies", async ({
    request,
  }) => {
    const res = await request.get("/api/companies/by-skill/DSA");
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.length > 0) {
      expect(body[0].hiringCriteria.skills).toEqual(
        expect.arrayContaining(["DSA"])
      );
    }
  });

  test("GET /api/companies/by-skill/dsa - case insensitive", async ({
    request,
  }) => {
    const res1 = await request.get("/api/companies/by-skill/DSA");
    const res2 = await request.get("/api/companies/by-skill/dsa");
    expect(await res1.json()).toEqual(await res2.json());
  });

  // 4. /companies/by-location/:location
  test("GET /api/companies/by-location/Hyderabad", async ({ request }) => {
    const res = await request.get("/api/companies/by-location/Hyderabad");
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.length > 0) {
      expect(body[0].location.toLowerCase()).toContain("hyderabad");
    }
  });

  test("GET /api/companies/by-location/hyderabad - case insensitive", async ({
    request,
  }) => {
    const res1 = await request.get("/api/companies/by-location/Hyderabad");
    const res2 = await request.get("/api/companies/by-location/hyderabad");
    expect(await res1.json()).toEqual(await res2.json());
  });

  // 5. /companies/headcount-range
  test("GET /api/companies/headcount-range?min=1000", async ({ request }) => {
    const res = await request.get("/api/companies/headcount-range?min=1000");
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.length > 0) {
      expect(body[0].headcount).toBeGreaterThanOrEqual(1000);
    }
  });

  test("GET /api/companies/headcount-range?min=1000&max=5000", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/companies/headcount-range?min=1000&max=5000"
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.length > 0) {
      expect(body[0].headcount).toBeGreaterThanOrEqual(1000);
      expect(body[0].headcount).toBeLessThanOrEqual(5000);
    }
  });

  test("GET /api/companies/headcount-range?min=abc - invalid input", async ({
    request,
  }) => {
    const res = await request.get("/api/companies/headcount-range?min=abc");
    expect([200, 400]).toContain(res.status());
  });

  // 6. /companies/benefit/:benefit
  test("GET /api/companies/benefit/Insurance", async ({ request }) => {
    const res = await request.get("/api/companies/benefit/Insurance");
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.length > 0) {
      expect(JSON.stringify(body[0].benefits).toLowerCase()).toContain(
        "insurance"
      );
    }
  });

  test("GET /api/companies/benefit/insurance - case insensitive", async ({
    request,
  }) => {
    const res1 = await request.get("/api/companies/benefit/Insurance");
    const res2 = await request.get("/api/companies/benefit/insurance");
    expect(await res1.json()).toEqual(await res2.json());
  });
});
