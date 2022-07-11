import Table from "./table";

type AccessConditionParams = {
  id?: number;
  type?: string;
  quest_id?: number;
  value?: string
};
const defaultItem: AccessConditionParams = {
  id: 1,
  type: "type",
  quest_id: 0,
  value: ""

};
class AccessConditions extends Table<AccessConditionParams> {
  protected name = "access_conditions";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "type VARCHAR(255)",
    "quest_id INTEGER",
    "value VARCHAR(255)"
  ];
  constructor() {
    super(defaultItem);
  }
}
const accessConditions = new AccessConditions();
export default accessConditions;
export type { AccessConditionParams };
