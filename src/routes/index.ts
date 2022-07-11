import fs from "fs";
import glob from "glob";
import OpenAPIBackend, { Context } from "openapi-backend";
import Comments from "parse-comments";

type RouteObject = {
  name: string;
  handler: (
    c: Context,
    req: OpenapiRequest,
    res: OpenapiResponse
  ) => Promise<any>;
};
class Routes {
  private basePath: string;
  private fileList: string[];

  constructor(basePath: string) {
    this.basePath = basePath;
    this.fileList = glob.sync(`${basePath}/**/*.ts`);
  }

  get routes(): RouteObject[] {
    return this.fileList
      .map((file) => {
        const routeComment = new RouteComment(file);
        if (routeComment.operation) {
          return {
            name: routeComment.operation,
            handler: this.getHandler(file),
          };
        }
        return null;
      })
      .filter((route): route is RouteObject => route !== null);
  }

  private formatPath(file: string) {
    return file.replace(this.basePath, ".").replace("index.ts", "");
  }
  private getHandler(file: string) {
    return (c: Context, req: OpenapiRequest, res: OpenapiResponse) => {
      let route = require(this.formatPath(file)).default;
      return route(c, req, res);
    };
  }
}

class RouteComment {
  private file: string;
  public operation: string | false;

  constructor(file: string) {
    this.file = file;
    const comments = new Comments();
    const content = fs.readFileSync(this.file, "utf8");
    const commentsContent = comments.parse(content);
    const routeComment = commentsContent.find((comment) =>
      comment.value.includes("OPENAPI-ROUTE")
    );
    if (!routeComment) this.operation = false;
    else this.operation = routeComment.value.split(":")[1].trim();
  }
}

export default (api: OpenAPIBackend) => {
  const routeHandler = new Routes("./src/routes");
  routeHandler.routes.forEach((route) => {
    api.register(route.name, route.handler);
  });
};
