import Database from "./Database";
class Campaigns extends Database<{ fields: { id: number; title: string } }> {
  constructor(fields?: Campaigns["fields"][number][] | ["*"]) {
    super({
      table: "wp_appq_evd_campaign",
      primaryKey: "id",
      fields: fields ? fields : ["id", "title"],
    });
  }
}
export default Campaigns;
