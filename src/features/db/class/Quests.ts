import Database from "./Database";
class Quests extends Database<{
  fields: { id: number; name: string; service_id: number };
}> {
  constructor(example?: Quests["example"]) {
    super({
      table: "quests",
      primaryKey: "id",
      example: example
        ? example
        : {
            id: 1,
            name: "My quest name",
            service_id: 0,
          },
    });
  }
}
export default Quests;
