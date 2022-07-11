/**  OPENAPI-ROUTE : get-quests */
import { Context } from "openapi-backend";

export default (c: Context, req: Request, res: OpenapiResponse) => {
  res.status_code = 404;
  return { pippo: "franco" };
};
