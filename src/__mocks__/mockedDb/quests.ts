import Table from "./table";

type QuestParams = {
  id?: number;
  name?: string;
  service_id?: number;
};
const defaultItem: QuestParams = {
  id: 1,
  name: "???",
  service_id: 0,
};
class Quests extends Table<QuestParams> {
  protected name = "quests";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "name VARCHAR(255)",
    "service_id INTEGER",
  ];
  constructor() {
    super(defaultItem);
  }
}
const quests = new Quests();
export default quests;
export type { QuestParams };
