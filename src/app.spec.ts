import app from "@src/app";
import request from "supertest";
import fs from "fs";
import getExample from "@src/middleware/getExample";
jest.mock("@src/middleware/getExample");
describe("App", () => {
  it("should return a valid app", () => {
    expect(app).toBeInstanceOf(Function);
  });
  it("should return the reference", async () => {
    const response = await request(app).get("/reference/");
    expect(response.status).toBe(200);
    const referenceFile = fs.readFileSync(
      "./src/reference/openapi.yaml",
      "utf8"
    );
    expect(response.text).toEqual(referenceFile);
  });
  it("should return the reference sub-api", async () => {
    const response = await request(app).get(
      "/reference/AccessConditions/AccessConditions.yaml"
    );
    expect(response.status).toBe(200);
    const referenceFile = fs.readFileSync(
      "./src/reference/AccessConditions/AccessConditions.yaml",
      "utf8"
    );
    expect(response.text).toEqual(referenceFile);
  });
  it("should return a specific example if requested", async () => {
    const response = await request(app)
      .get("/")
      .set("x-tryber-mock-example", "200:test");
    expect(getExample).toBeCalledTimes(1);
    expect(getExample).toBeCalledWith(
      expect.anything(),
      "/",
      "GET",
      "200",
      "test"
    );
  });
});
