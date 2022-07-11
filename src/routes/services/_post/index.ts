/**  OPENAPI-ROUTE : post-services */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";
import { Response200, Response400, Body } from "./types";

export default async (
  c: Context,
  req: OpenapiRequest,
  res: OpenapiResponse
): Promise<Response200 | Response400> => {
  const body = req.body as Body;
  const { templateId, name } = body;
  const serviceTemplate = await getServiceTemplate();
  if (!serviceTemplate) {
    res.status_code = 400;
    return {
      error: "Template not found",
    };
  }

  const service = await db.query(
    db.format("INSERT INTO services (name) VALUES (?)", [name])
  );
  const serviceId = service.insertId;
  const config = JSON.parse(serviceTemplate.config);

  await createQuests();

  res.status_code = 200;
  return {};

  async function createQuests() {
    if (config.quests) {
      for (const quest of config.quests) {
        await db.query(
          db.format("INSERT INTO quests (name, service_id) VALUES (?, ?)", [
            quest.name,
            serviceId,
          ])
        );
      }
    }
  }

  async function getServiceTemplate() {
    const templates = await db.query(
      db.format("SELECT id,config FROM service_templates WHERE id = ?", [
        templateId,
      ])
    );
    return templates.length === 0 ? null : templates[0];
  }
};
