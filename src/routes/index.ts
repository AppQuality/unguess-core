import debugMessage from "@src/features/debugMessage";
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
        if (routeComment.operationClass) {
          return {
            name: routeComment.operationClass,
            handler: this.getClassHandler(file),
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
  private getClassHandler(file: string) {
    return async (
      context: Context,
      request: OpenapiRequest,
      response: OpenapiResponse
    ) => {
      try {
        let Class = require(this.formatPath(file)).default;
        const route = new Class({ context, request, response });
        return await route.resolve();
      } catch (e) {
        debugMessage((e as OpenapiError).message);
        response.status_code = 500;
        return { message: (e as OpenapiError).message };
      }
    };
  }
}

class RouteComment {
  public operation: string | false;
  public operationClass: string | false;

  constructor(file: string) {
    const comments = this.extractFileContent(file);
    const routeComment = comments.find((comment) =>
      comment.value.includes("OPENAPI-ROUTE")
    );
    if (!routeComment) this.operation = false;
    else this.operation = routeComment.value.split(":")[1].trim();

    const classComment = comments.find((comment) =>
      comment.value.includes("OPENAPI-CLASS")
    );
    if (!classComment) this.operationClass = false;
    else this.operationClass = classComment.value.split(":")[1].trim();
  }

  extractFileContent(file: string) {
    const comments = new Comments();
    const fileContent = fs.readFileSync(file, "utf8");
    return comments.parse(fileContent);
  }
}

export default (api: OpenAPIBackend) => {
  const routeHandler = new Routes("./src/routes");
  routeHandler.routes.forEach((route) => {
    api.register(route.name, route.handler);
  });
};
