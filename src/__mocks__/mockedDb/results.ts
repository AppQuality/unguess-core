import Table from "./table";

type ResultsParams = {
  id?: number;
  type?: string;
  author_id?: number;
  author_src?: string;
  approved?: number;
  step_id?: number;
};
const defaultItem: ResultsParams = {
  id: 1,
  type: "type",
  author_id: 0,
  author_src: "TRYBER",
  approved: 0,
  step_id: 0,
};
class Results extends Table<ResultsParams> {
  protected name = "results";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "type VARCHAR(255)",
    "author_id INTEGER",
    "step_id INTEGER",
    "author_src VARCHAR(64)",
    "approved boolean",
  ];
  constructor() {
    super(defaultItem);
  }
}
const results = new Results();
export default results;
export type { ResultsParams };
