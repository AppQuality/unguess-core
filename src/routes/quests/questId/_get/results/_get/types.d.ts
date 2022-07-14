export type Params =
  StoplightOperations["get-quests-questId-results"]["parameters"]["path"];
export type Response200 =
  StoplightOperations["get-quests-questId-results"]["responses"]["200"]["content"]["application/json"];

export type Response400 = {
  error: string;
};
