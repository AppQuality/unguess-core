/**  OPENAPI-ROUTE : post-steps-stepId */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";
import { Response200, Response400, Body, Params } from "./types";

export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
): Promise<Response200 | Response400> => {
  const { author, result } = req.body as Body;
  const { stepId } = c.request.params as Params;
  const step = await getStepById();
  if (!step) {
    res.status_code = 400;
    return {
      error: "step not found",
    };
  }

  try {
    const item = await createResult();

    if (isMediaResult()) {
      await createMediaResult(item.id);
    }
  } catch (e) {
    res.status_code = 400;
    return {
      error: (e as OpenapiError).message,
    };
  }

  res.status_code = 200;

  return {};

  async function createResult() {
    let columns = ["step_id", "approved"];
    let values = [stepId, result.approved ? 1 : 0];
    if (author) {
      columns = [...columns, "author_id", "author_src"];
      values = [...values, author.id, author.source];
    }
    const res = await db.query(
      db.format(
        `INSERT INTO results 
        (${columns.join(", ")}) 
        VALUES (${columns.map(() => `?`).join(", ")})`,
        values
      )
    );
    if (!res.insertId) {
      throw new Error("Error on INSERT");
    }
    return { ...result, id: res.insertId };
  }

  async function createMediaResult(id: number) {
    await db.query(
      db.format("INSERT INTO results_media (result_id,path) VALUES (?,?)", [
        id,
        result.item.path,
      ])
    );
  }

  function isMediaResult() {
    return step && step.type === "media";
  }

  async function getStepById(): Promise<{ id: number; type: string } | false> {
    try {
      const steps = await db.query(
        db.format(`SELECT id,type FROM steps WHERE id = ?`, [stepId])
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
