import Table from "./table";

type ResultsMediaParams = {
  id?: number;
  results_id: number;
  path: string;
};
const defaultItem: ResultsMediaParams = {
  id: 1,
  results_id: 0,
  path: "https://google.com",
};
class ResultsMedia extends Table<ResultsMediaParams> {
  protected name = "results_media";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "results_id INTEGER",
    "path text",
  ];
  constructor() {
    super(defaultItem);
  }
}
const resultsMedia = new ResultsMedia();
export default resultsMedia;
export type { ResultsMediaParams };
