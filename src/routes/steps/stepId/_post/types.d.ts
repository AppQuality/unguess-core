export type Body =
  StoplightOperations["post-steps-stepId"]["requestBody"]["content"]["application/json"];
export type Params =
  StoplightOperations["post-steps-stepId"]["parameters"]["path"];
export type Response200 =
  StoplightOperations["post-steps-stepId"]["responses"]["200"]["content"]["application/json"];

export type Response400 = {
  error: string;
};
