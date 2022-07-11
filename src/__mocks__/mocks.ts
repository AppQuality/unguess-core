import { Context } from "openapi-backend";

jest.mock("@src/features/db");
jest.mock("@src/middleware/keySecurityHandler", () => {
  return (c: Context) => {
    let authHeader = c.request.headers["authorization"];
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    if (typeof authHeader !== "string") {
      throw new Error("Authorization header is not a string");
    }
    if (!authHeader) {
      throw new Error("No token");
    }
    if (!["valid"].includes(authHeader)) {
      throw new Error("Invalid token");
    }
    return true;
  };
});
export {};
