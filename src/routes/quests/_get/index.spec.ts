import request from "supertest";
import quests from "@src/__mocks__/mockedDb/quests";
import accessConditions from "@src/__mocks__/mockedDb/accessConditions";

import app from "@src/app";

describe("Quests", () => {
  beforeAll(() => {
    quests.insert({
      id: 1,
      name: "Test Quest 1",
    });
    quests.insert({
      id: 2,
      name: "Test Quest 2",
    });
    accessConditions.insert({
      id: 1,
      type: "timed",
      value: "2020-01-01",
      quest_id: 2,
    });
    quests.insert({
      id: 3,
      name: "Test Quest 3",
    });
    quests.insert({
      id: 4,
      name: "Test Quest 4",
    });
    accessConditions.insert({
      id: 2,
      type: "testerlist",
      value: "1,2",
      quest_id: 4,
    });
  });
  it("should answer 403 if not authorized", async () => {
    return request(app).get("/quests").expect(403);
  });
  it("should answer 200 if authorized", async () => {
    const response = await request(app)
      .get("/quests")
      .set("authorization", "valid");
    expect(response.status).toBe(200);
  });
  it("should answer with a list of quests", async () => {
    const response = await request(app)
      .get("/quests")
      .set("authorization", "valid");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
  });
  it("should answer with a name for each quest", async () => {
    const response = await request(app)
      .get("/quests")
      .set("authorization", "valid");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
    expect(response.body[0]).toHaveProperty("name", "Test Quest 1");
    expect(response.body[1]).toHaveProperty("name", "Test Quest 2");
    expect(response.body[2]).toHaveProperty("name", "Test Quest 3");
    expect(response.body[3]).toHaveProperty("name", "Test Quest 4");
  });
  it("should answer with the access conditions for each quests", async () => {
    const response = await request(app)
      .get("/quests")
      .set("authorization", "valid");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
    expect(response.body[0]).not.toHaveProperty("access");
    expect(response.body[1]).toHaveProperty("access", [
      { type: "timed", endDate: "2020-01-01" },
    ]);
    expect(response.body[2]).not.toHaveProperty("access");
    expect(response.body[3]).toHaveProperty("access", [
      {
        type: "testerlist",
        list: [1, 2],
      },
    ]);
  });
});
