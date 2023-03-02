/**  OPENAPI-CLASS : get-quests-questId */
import * as db from "@src/features/db";
import { Response200, Response400, Params } from "./types";
import QuestRoute from "@src/features/routes/QuestRoute";

export default class Quest extends QuestRoute<{
  response: Response200 | Response400;
  parameters: Params;
}> {
  protected async prepare() {
    const quest = await this.getQuest();

    if (!quest) return this.setError(404, {} as OpenapiError);

    this.setSuccess(200, quest);
  }

  private async getQuest() {
    const quest = await db.query(
      `SELECT * FROM quests WHERE id = ${this.questId}`
    );

    if (!quest.length) return false;
    return quest[0];
  }
}
