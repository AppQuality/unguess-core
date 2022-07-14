import request from "supertest";
import Quests from "@src/__mocks__/mockedDb/quests";
import app from "@src/app";

beforeAll(async () => {
  await Quests.insert({
    id: 1,
  });
});
describe("Get /quests/{questsId}", () => {
  afterEach(async () => {});
  it("should answer 403 without api key", async () => {
    return request(app).get("/quests/1").expect(403);
  });
  it("should answer 403 with invalid api key", async () => {
    return request(app)
      .get("/quests/1")
      .set("authorization", "invalid")
      .expect(403);
  });

  it("should answer 400 when the quest id does not exists", async () => {
    return request(app)
      .get("/quests/100")
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 200 when the quest id exists", async () => {
    return request(app)
      .get("/quests/1")
      .set("authorization", "valid")
      .expect(200);
  });
});
