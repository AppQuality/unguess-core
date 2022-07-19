import keySecurityHandler from ".";
import config from "@src/config";
jest.unmock(".");
jest.mock("@src/config", () => {
  const actual = jest.requireActual("@src/config");
  return {
    ...actual.default,
    validTokens: ["test"],
  };
});

describe("Key security handler", () => {
  it("should return a middleware", () => {
    expect(keySecurityHandler).toBeInstanceOf(Function);
  });
  it("should throw error if no auth header exists", async () => {
    try {
      //@ts-ignore
      await keySecurityHandler({ request: { headers: {} } });
    } catch (e) {
      expect((e as { message: string }).message).toEqual(
        "No authorization header"
      );
      return;
    }
    throw new Error("Middleware should throw error");
  });
  it("should throw error if auth header is not a string", async () => {
    try {
      //@ts-ignore
      await keySecurityHandler({
        request: { headers: { authorization: 1 } },
      });
    } catch (e) {
      expect((e as { message: string }).message).toEqual(
        "Authorization header is not a string"
      );
      return;
    }
    throw new Error("Middleware should throw error");
  });
  it("should throw error if there's no token", async () => {
    try {
      //@ts-ignore
      await keySecurityHandler({
        request: { headers: { authorization: "test" } },
      });
    } catch (e) {
      expect((e as { message: string }).message).toEqual("No token");
      return;
    }
    throw new Error("Middleware should throw error");
  });
  it("should throw error if the token is invalid", async () => {
    try {
      //@ts-ignore
      await keySecurityHandler({
        request: { headers: { authorization: "Bearer invalid" } },
      });
    } catch (e) {
      expect((e as { message: string }).message).toEqual("Invalid token");
      return;
    }
    throw new Error("Middleware should throw error");
  });
  it("should return true if token is valid", async () => {
    try {
      //@ts-ignore
      const result = await keySecurityHandler({
        request: { headers: { authorization: "Bearer test" } },
      });
      expect(result).toBe(true);
    } catch (e) {
      console.log(e);
      throw new Error("Middleware should not throw error");
    }
  });
});
