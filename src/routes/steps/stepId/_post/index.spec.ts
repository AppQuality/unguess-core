import request from "supertest";
import Steps from "@src/__mocks__/mockedDb/steps";
import Results from "@src/__mocks__/mockedDb/results";
import ResultsMedia from "@src/__mocks__/mockedDb/resultsMedia";
import app from "@src/app";

beforeAll(async () => {
  await Steps.insert({
    id: 1,
    type: "media",
    quest_id: 1,
  });
});
describe("POST /steps/{stepsId}", () => {
  afterEach(async () => {
    await Results.clear();
    await ResultsMedia.clear();
  });

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
  it("should answer 400 when no item is declared", async () => {
    return request(app)
      .post("/steps/1")
      .send({
        result: { approved: false },
      })
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
    expect(response.status).toBe(200);
  });

  it("should answer return approved as false if not provided", async () => {
    const response = await request(app)
      .post("/steps/1")
      .send({
        result: { item: { path: "https://google.com" } },
      })
      .set("authorization", "valid");
    expect(response.status).toBe(200);

    const res = await Results.first(
      ["approved"],
      [
        {
          step_id: 1,
        },
      ]
    );
    expect(res).not.toBeNull();
    expect(res.approved).toBe(0);
  });

  it("should answer return approved as true if provided", async () => {
    const response = await request(app)
      .post("/steps/1")
      .send({
        result: { approved: true, item: { path: "https://google.com" } },
      })
      .set("authorization", "valid");
    expect(response.status).toBe(200);

    const res = await Results.first(undefined, [
      {
        step_id: 1,
      },
    ]);
    expect(res).not.toBeUndefined();
    expect(res.approved).toBe(1);
  });
});

describe("POST /steps/{stepsId} - media type", () => {
  afterEach(async () => {
    await Results.clear();
    await ResultsMedia.clear();
  });

  it("should insert a media if a path is provided", async () => {
    const response = await request(app)
      .post("/steps/1")
      .send({
        result: { item: { path: "https://google.com" } },
      })
      .set("authorization", "valid");
    expect(response.status).toBe(200);

    const result = await Results.first(undefined, [
      {
        step_id: 1,
      },
    ]);
    expect(result).not.toBeUndefined();
    const media = await ResultsMedia.first(undefined, [
      {
        result_id: result.id,
      },
    ]);
    expect(media).not.toBeUndefined();
  });
});
