import Table from "./table";

type StepParams = {
  id?: number;
  type?: string;
  quest_id?: number;
  description?: string
};
const defaultItem: StepParams = {
  id: 1,
  type: "type",
  quest_id: 0,
  description: "my step"
};
class Steps extends Table<StepParams> {
  protected name = "steps";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "type VARCHAR(255)",
    "quest_id INTEGER",
    "description VARCHAR(255)"
  ];
  constructor() {
    super(defaultItem);
  }
}
const steps = new Steps();
export default steps;
export type { StepParams };
