import Table from "./table";

type ResultsMediaParams = {
  id?: number;
  result_id?: number;
  path?: string;
};
const defaultItem: ResultsMediaParams = {
  id: 1,
  result_id: 0,
  path: "https://google.com",
};
class ResultsMedia extends Table<ResultsMediaParams> {
  protected name = "results_media";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "result_id INTEGER",
    "path text",
  ];
  constructor() {
    super(defaultItem);
  }
}
const resultsMedia = new ResultsMedia();
export default resultsMedia;
export type { ResultsMediaParams };
