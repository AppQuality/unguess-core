/**  OPENAPI-ROUTE : post-steps-stepId */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";
import { Response200, Response400, Body, Params } from "./types";

export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
): Promise<Response200 | Response400> => {
  const { stepId } = c.request.params as Params;
  const step = await getStepById();
  if (!step) {
    res.status_code = 400;
    return {
      error: "step not found",
    };
  }
  res.status_code = 200;
  return {};

  async function getStepById() {
    try {
      const steps = await db.query(
        db.format(`SELECT * FROM steps WHERE id = ?`, [stepId])
      );
      if (steps.length === 0) {
        return false;
      }
      return steps[0];
    } catch (e) {
      return false;
    }
  }
};
