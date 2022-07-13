import request from "supertest";
import Steps from "@src/__mocks__/mockedDb/steps";
import app from "@src/app";

beforeAll(async () => {
  await Steps.insert({
    id: 1,
    type: "media",
    quest_id: 1,
  });
});
describe("POST /steps/{stepsId}", () => {
  it("should answer 403 without api key", async () => {
    return request(app).post("/steps/1").expect(403);
  });
  it("should answer 403 with invalid api key", async () => {
    return request(app)
      .post("/steps/1")
      .set("authorization", "invalid")
      .expect(403);
  });
  it("should answer 400 when no result is declared", async () => {
    return request(app)
      .post("/steps/1")
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 400 when the step id does not exists", async () => {
    return request(app)
      .post("/steps/100")
      .send({
        result: { approved: false, item: { path: "https://google.com" } },
      })
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 200 with valid api key", async () => {
    const response = await request(app)
      .post("/steps/1")
      .send({
        result: { approved: false, item: { path: "https://google.com" } },
      })
      .set("authorization", "valid");
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});
