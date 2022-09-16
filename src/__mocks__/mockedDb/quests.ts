import Table from "./table";

import QuestsTable from "@src/features/db/class/Quests";
const questTable = new QuestsTable();

type QuestParams = NonNullable<Partial<QuestsTable["example"]>>;

class Quests extends Table<QuestParams> {
  protected name = questTable.name();
  protected columns = questTable.columns();
  constructor() {
    super(questTable.defaultItem() as QuestParams);
  }
}
const quests = new Quests();
export default quests;
export type { QuestParams };
