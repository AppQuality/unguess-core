import request from "supertest";

import app from "@src/app";

describe("Quests", () => {
  it("should not pippo franco if not logged in", async () => {
    return request(app).get("/quests").expect(403);
  });
  it("should pippo franco", async () => {
    return request(app)
      .get("/quests")
      .set("authorization", "valid")
      .expect(404, {
        pippo: "franco",
      });
  });
});
