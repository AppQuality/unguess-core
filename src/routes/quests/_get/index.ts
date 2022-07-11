/**  OPENAPI-ROUTE : get-quests */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";

export default async (c: Context, req: Request, res: OpenapiResponse) => {
  await db.query("INSERT INTO quests (name) VALUES ('franco')");
  const quest = await db.query("SELECT * FROM quests");

  res.status_code = 404;
  return { pippo: quest[0].name };
};
