export type Params =
  StoplightOperations["get-quests-questId"]["parameters"]["path"];
export type Response200 =
  StoplightOperations["get-quests-questId"]["responses"]["200"]["content"]["application/json"];

export type Response400 = {
  error: string;
};
