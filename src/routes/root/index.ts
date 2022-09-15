/**  OPENAPI-CLASS : get-root */
import Route from "@src/features/routes/Route";
import getBranch from "./getBranch";
import getRevision from "./getRevision";

export default class RouteItem extends Route<{
  response: StoplightOperations["get-root"]["responses"]["200"]["content"]["application/json"];
}> {
  protected async prepare() {
    let revision = getRevision();
    let branch = getBranch();
    this.setSuccess(200, { branch, revision });
  }
}
