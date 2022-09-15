import request from "supertest";

import app from "@src/app";
import getBranch from "./getBranch";
import getRevision from "./getRevision";

jest.mock("./getBranch");
jest.mock("./getRevision");

describe("Root endpoint", () => {
  it("GET on /authenticate with correct data should answer 200", async () => {
    const [branch, revision] = ["master", "12345"];
    (getBranch as jest.Mock).mockReturnValue(branch);
    (getRevision as jest.Mock).mockReturnValue(revision);
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ branch, revision });
  });
});
