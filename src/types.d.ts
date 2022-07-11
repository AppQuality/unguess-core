import { Response } from "express";
import { Request } from "openapi-backend";
import { components, operations, paths } from "./schema";

declare global {
  interface OpenapiResponse extends Response {
    skip_post_response_handler?: boolean;
    status_code: number;
  }
  interface OpenapiRequest extends Request {
    query: { [key: string]: string | { [key: string]: string } };
  }
  interface OpenapiError extends Error {
    status_code: number;
  }
  interface MySqlError extends Error {
    code: string;
  }

  interface StoplightOperations extends operations {}
  interface StoplightComponents extends components {}
  interface StoplightPaths extends paths {}

  type ServiceConfiguration = {
    quests: {
      name: string;
      accessConditions: {
        type: components["schemas"]["AccessCondition"]["type"];
        value: string;
      }[];
    }[];
  };
}
