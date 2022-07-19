import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import OpenAPIBackend, { Options, Request } from "openapi-backend";
import config from "@src/config";
import middleware from "./middleware";
import getExample from "./middleware/getExample";
import routes from "./routes";
import fs from "fs";

const opts: Options = {
  definition: __dirname + "/reference/openapi.yaml",
  quick: true,
};

let referencePath = "/reference/";
if (config.apiRoot) {
  opts.apiRoot = config.apiRoot;
  referencePath = config.apiRoot + referencePath;
}
const api = new OpenAPIBackend(opts);
api.register({
  notFound: middleware.notFound,
  unauthorizedHandler: middleware.unauthorized,
  validationFail: middleware.validationFail,
});

api.registerHandler("notImplemented", middleware.notImplemented(api));
// register security handler for jwt auth
api.registerSecurityHandler("Key", middleware.keySecurityHandler);
api.register("postResponseHandler", middleware.postResponseHandler);
routes(api);
api.init();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get(referencePath, function (req, res) {
  res.sendFile(__dirname + "/reference/openapi.yaml");
});
app.get(`${referencePath}*`, function (req, res) {
  const path = req.path.replace(referencePath, "");
  if (!fs.existsSync(__dirname + "/reference/" + path)) {
    res.status(404).send("Not found");
    return;
  }
  res.sendFile(__dirname + "/reference/" + path);
});

app.use((req, res) => {
  if (req.rawHeaders.includes("x-tryber-mock-example")) {
    let exampleData = req.headers["x-tryber-mock-example"];
    if (typeof exampleData === "string") {
      exampleData = exampleData.split(":");
      if (exampleData.length === 2) {
        let path = req.path;
        if (config.apiRoot) {
          path = path.replace(new RegExp(`^${config.apiRoot}`), "");
        }
        const example = getExample(
          api,
          path,
          req.method,
          exampleData[0],
          exampleData[1]
        );
        if (example) {
          return res.status(parseInt(exampleData[0])).json(example);
        }
      }
    }
  }
  return api.handleRequest(req as Request, req, res);
});

export default app;
