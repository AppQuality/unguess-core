export type Body =
  StoplightOperations["post-services"]["requestBody"]["content"]["application/json"];
export type Response200 =
  StoplightOperations["post-services"]["responses"]["200"]["content"]["application/json"];

export type Response400 = {
  error: string;
};
