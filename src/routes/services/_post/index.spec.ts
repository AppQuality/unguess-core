import request from "supertest";
import Quests from "@src/__mocks__/mockedDb/quests";
import Services from "@src/__mocks__/mockedDb/service";
import ServiceTemplates from "@src/__mocks__/mockedDb/serviceTemplates";

import app from "@src/app";

beforeAll(async () => {
  await ServiceTemplates.insert({
    id: 1,
    name: "My service",
    config: `{"quests": [{"name": "My quest"}]}`,
  });
  await ServiceTemplates.insert({
    id: 2,
    name: "My service with two quests",
    config: `{"quests": [{"name": "My quest"},{"name": "My second quest"}]}`,
  });
});

afterAll(async () => {
  await ServiceTemplates.clear();
});

describe("POST /services", () => {
  afterEach(async () => {
    await Services.clear();
    await Quests.clear();
  });
  it("should answer 403 without api key", async () => {
    return request(app).post("/services").expect(403);
  });
  it("should answer 403 with invalid api key", async () => {
    return request(app)
      .post("/services")
      .set("authorization", "invalid")
      .expect(403);
  });
  it("should answer 400 when no template id is declared", async () => {
    return request(app)
      .post("/services")
      .send({ name: "New service" })
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 400 when no name is declared", async () => {
    return request(app)
      .post("/services")
      .send({ templateId: 1 })
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 400 when the template id requested does not exists", async () => {
    return request(app)
      .post("/services")
      .send({ name: "New service", templateId: 100 })
      .set("authorization", "valid")
      .expect(400);
  });
  it("should answer 200 with valid api key", async () => {
    return request(app)
      .post("/services")
      .send({ name: "New service", templateId: 1 })
      .set("authorization", "valid")
      .expect(200);
  });

  it("should create a service after a valid request", async () => {
    const servicesBefore = await Services.all();
    expect(servicesBefore.length).toBe(0);
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 1 })
      .set("authorization", "valid");
    const servicesAfter = await Services.all();
    expect(servicesAfter.length).toBe(1);
  });
  it("should create a service with the name specified", async () => {
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 1 })
      .set("authorization", "valid");
    const services = await Services.all();
    expect(services.length).toBe(1);
    expect(services[0].name).toBe("New service");
  });
  it("should create a service with a quest if the template has the configuration for it", async () => {
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 1 })
      .set("authorization", "valid");
    const service = await Services.first();
    expect(service).not.toBeNull();
    const quests = await Quests.all(undefined, [{ service_id: service.id }]);
    expect(quests.length).toBe(1);
  });
  it("should create a service with two quest if the template has two quest configured", async () => {
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 2 })
      .set("authorization", "valid");
    const service = await Services.first();
    expect(service).not.toBeNull();
    const quests = await Quests.all(undefined, [{ service_id: service.id }]);
    expect(quests.length).toBe(2);
  });
});
