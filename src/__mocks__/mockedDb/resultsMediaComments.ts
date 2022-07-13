import Table from "./table";

type ResultsMediaCommentsParams = {
  id?: number;
  result_media_id?: number;
  title?: string;
  description?: string;
  timestamp?: number;
};
const defaultItem: ResultsMediaCommentsParams = {
  id: 1,
  result_media_id: 0,
  title: "title",
  description: "description",
  timestamp: 0, // timestamp video, at what timestamp the comment was made
};
class ResultsMediaComments extends Table<ResultsMediaCommentsParams> {
  protected name = "results_media";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "result_media_id INTEGER",
    "title VARCHAR(255)",
    "description VARCHAR(255)",
    "timestamp INTEGER",
  ];
  constructor() {
    super(defaultItem);
  }
}
const resultsMediaComments = new ResultsMediaComments();
export default resultsMediaComments;
export type { ResultsMediaCommentsParams };
