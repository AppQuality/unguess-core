import request from "supertest";
import Quests from "@src/__mocks__/mockedDb/quests";
import Steps from "@src/__mocks__/mockedDb/steps";
import Results from "@src/__mocks__/mockedDb/results";
import ResultsMedia from "@src/__mocks__/mockedDb/resultsMedia";
import app from "@src/app";

beforeAll(async () => {
  await Quests.insert({
    id: 1,
  });
  await Steps.insert({
    id: 1,
    type: "media",
    quest_id: 1,
  });
  await Quests.insert({
    id: 2,
  });
  await Steps.insert({
    id: 2,
    type: "media",
    quest_id: 2,
  });
  await Results.insert({
    id: 1,
    step_id: 1,
    approved: 0,
    author_id: 1,
    author_src: "tryber",
  });
  await ResultsMedia.insert({
    id: 1,
    result_id: 1,
    path: "https://google.com",
  });
});
describe("Get /quests/{questsId}/results", () => {
  afterEach(async () => {});
  it("should answer 403 without api key", async () => {
    return request(app).get("/quests/1/results").expect(403);
  });
  it("should answer 403 with invalid api key", async () => {
    return request(app)
      .get("/quests/1/results")
      .set("authorization", "invalid")
      .expect(403);
  });

  it("should answer 400 when the quest id does not exists", async () => {
    return request(app)
      .get("/quests/100/results")
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 200 when the quest id exists", async () => {
    return request(app)
      .get("/quests/1/results")
      .set("authorization", "valid")
      .expect(200);
  });

  it("should answer with a list of results if the quest has results", async () => {
    const response = await request(app)
      .get("/quests/1/results")
      .set("authorization", "valid");

    expect(response.body).toMatchObject([
      {
        item: {
          path: "https://google.com",
        },
        author: { id: 1, source: "tryber" },
        approved: false,
      },
    ]);
  });

  it("should answer with a list of steps", async () => {
    const response = await request(app)
      .get("/quests/1/results")
      .set("authorization", "valid");

    expect(response.body).toMatchObject([{ step: { id: 1, type: "media" } }]);
  });
  it("should answer with an empty list of steps if no result is present", async () => {
    const response = await request(app)
      .get("/quests/2/results")
      .set("authorization", "valid");

    expect(response.body).toMatchObject([]);
  });
});
