/**  OPENAPI-ROUTE : post-services */
import { Context } from "openapi-backend";
import * as db from "@src/features/db";
import { Response200, Response400, Body } from "./types";

type Quest = ServiceConfiguration["quests"][0] & { id: number };

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
  const config: ServiceConfiguration = JSON.parse(serviceTemplate.config);

  const quests = await createQuests();
  for (const quest of quests) {
    await createAccessConditions(quest);
  }

  res.status_code = 200;
  return {};

  async function createQuests() {
    const results: Quest[] = [];
    if (config.quests) {
      for (const quest of config.quests) {
        const newQuest = await db.query(
          db.format("INSERT INTO quests (name, service_id) VALUES (?, ?)", [
            quest.name,
            serviceId,
          ])
        );
        results.push({ ...quest, id: newQuest.insertId });
      }
    }
    return results;
  }

  async function createAccessConditions(quest: Quest) {
    if (quest.accessConditions) {
      for (const accessCondition of quest.accessConditions) {
        if (accessCondition.type)
          await db.query(
            db.format(
              `INSERT INTO access_conditions 
                  ( quest_id, type, value) 
                  VALUES ( ?, ?, ?)`,
              [quest.id, accessCondition.type, accessCondition.value]
            )
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
