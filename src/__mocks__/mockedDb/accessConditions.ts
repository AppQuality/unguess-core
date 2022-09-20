import Table from "./table";

import AccessConditionsTableTable from "@src/features/db/class/AccessConditions";
const accessConditionsTable = new AccessConditionsTableTable();

type QuestParams = NonNullable<Partial<AccessConditionsTableTable["example"]>>;

class AccessConditionsTable extends Table<QuestParams> {
  protected name = accessConditionsTable.name();
  protected columns = accessConditionsTable.columns();
  constructor() {
    super(accessConditionsTable.defaultItem() as QuestParams);
  }
}
const accessConditionss = new AccessConditionsTable();
export default accessConditionss;
export type { QuestParams };
