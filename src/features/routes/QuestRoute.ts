import Route from "./Route";
import * as db from "@src/features/db";

type QuestRootParamaters = { questId: string };

export default class Quest<
  T extends RouteClassTypes & {
    parameters: T["parameters"] & QuestRootParamaters;
  }
> extends Route<T> {
  protected questId: number;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);

    const params = this.getParameters();

    if (!params.questId) throw new Error("Missing quest id");

    this.questId = parseInt(params.questId);
  }

  protected async init(): Promise<void> {
    await super.init();

    if (isNaN(this.questId)) {
      this.setError(400, {} as OpenapiError);

      throw new Error("Invalid quest id");
    }

    const quest = await this.initQuest();

    if (!quest) {
      this.setError(400, {} as OpenapiError);

      throw new Error("Quest not found");
    }
  }

  private async initQuest() {
    const quest: {
      showNeedReview: boolean;
      project_id: number;
      base_bug_internal_id: string;
    }[] = await db.query(`SELECT * FROM quests WHERE id = ${this.questId}`);
    if (!quest.length) return false;
    return quest[0];
  }
}
