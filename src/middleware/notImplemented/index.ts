import OpenAPIBackend, { Context } from "openapi-backend";

export default (api: OpenAPIBackend) =>
  async (c: Context, req: Request, res: OpenapiResponse) => {
    res.skip_post_response_handler = true;
    if (process.env && process.env.DEBUG) {
      console.log(`Mocking ${c.operation.operationId}`);
    }

    const { status, mock } = api.mockResponseForOperation(
      c.operation.operationId || ""
    );
    return res.status(status).json(mock);
  };
