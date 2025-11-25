const request = require("supertest");
const app = require("../../src/app"); // ajuste conforme sua estrutura

describe("API Healthcheck", () => {
  it("should return status 200", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });
});
