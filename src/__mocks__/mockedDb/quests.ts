import Table from "./table";

type QuestParams = {
  name?: string;
};
const defaultItem: QuestParams = {
  name: "???",
};
class Quests extends Table<QuestParams> {
  protected name = "quests";
  protected columns = ["name VARCHAR(255)"];
  constructor() {
    super(defaultItem);
  }
}
const quests = new Quests();
export default quests;
export type { QuestParams };
