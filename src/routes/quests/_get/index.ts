/**  OPENAPI-CLASS : get-quests */
import Route from "@src/features/routes/Route";
import Quests from "@src/features/db/class/Quests";
import AccessConditions from "@src/features/db/class/AccessConditions";
import AccessConditionFactory from "@src/features/accessConditions/Factory";

class RouteItem extends Route<{
  response: StoplightOperations["get-quests"]["responses"]["200"]["content"]["application/json"];
}> {
  private db: {
    quests: Quests;
    accessConditions: AccessConditions;
  };
  constructor(config: RouteClassConfiguration) {
    super(config);
    this.db = {
      quests: new Quests(),
      accessConditions: new AccessConditions(),
    };
  }

  protected async prepare() {
    const quests = await this.getQuests();
    this.setSuccess(200, quests);
  }

  private async getQuests() {
    const quests = await this.db.quests.query({});
    const accessConditions = await this.db.accessConditions.query({
      where: [{ quest_id: quests.map((q) => q.id) }],
    });

    return quests.map((quest) => {
      const accessForThisQuest = accessConditions.filter(
        (a) => a.quest_id === quest.id
      );
      if (accessForThisQuest.length === 0) {
        return quest;
      }
      return {
        ...quest,
        access: accessForThisQuest.map((a) => {
          const item = AccessConditionFactory.create(a.type, a.value);
          return item.getCondition();
        }),
      };
    });
  }
}

export default RouteItem;
