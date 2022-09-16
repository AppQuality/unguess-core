import Database from "./Database";
class AccessConditions extends Database<{
  fields: {
    id: number;
    type: string;
    quest_id: number;
    value: string;
  };
}> {
  constructor(example?: AccessConditions["example"]) {
    super({
      table: "access_conditions",
      primaryKey: "id",
      example: example
        ? example
        : {
            id: 1,
            type: "type",
            quest_id: 0,
            value: "",
          },
    });
  }
}
export default AccessConditions;
