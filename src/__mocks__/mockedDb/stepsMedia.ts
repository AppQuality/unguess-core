import Table from "./table";

type MediaStepParams = {
  id?: number;
  step_id?: number;
  file_types?: string;
};
const defaultItem: MediaStepParams = {
  id: 1,
  step_id: 0,
};
class MediaSteps extends Table<MediaStepParams> {
  protected name = "steps_media";
  protected columns = [
    "id INTEGER PRIMARY KEY AUTOINCREMENT",
    "step_id INTEGER",
    "file_types VARCHAR(255)",
  ];
  constructor() {
    super(defaultItem);
  }
}
const mediaSteps = new MediaSteps();
export default mediaSteps;
export type { MediaStepParams };
