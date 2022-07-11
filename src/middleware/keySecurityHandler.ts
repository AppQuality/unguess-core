import { Context } from "openapi-backend";
import config from "../config";

export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
) => {
  let authHeader = c.request.headers["authorization"];
  if (!authHeader) {
    throw new Error("No authorization header");
  }
  if (typeof authHeader !== "string") {
    throw new Error("Authorization header is not a string");
  }
  let token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("No token");
  }
  if (!config.validTokens.includes(token)) {
    throw new Error("Invalid token");
  }
  return true;
};
