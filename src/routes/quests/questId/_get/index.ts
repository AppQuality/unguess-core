/**  OPENAPI-ROUTE : get-quests-questId */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";
import { Response200, Response400, Params } from "./types";

export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
): Promise<Response200 | Response400> => {
  const { questId } = c.request.params as Params;
  const quest = await getQuestById();
  if (!quest) {
    res.status_code = 400;
    return {};
  }

  res.status_code = 200;
  return {};

  async function getQuestById(): Promise<{ id: number } | false> {
    const quest = await db.query(
      db.format(`SELECT * FROM quests WHERE id = ?`, [questId])
    );
    if (!quest.length) {
      return false;
    }
    return quest[0];
  }
};
