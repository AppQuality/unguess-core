import request from "supertest";
import Quests from "@src/__mocks__/mockedDb/quests";
import Services from "@src/__mocks__/mockedDb/service";
import ServiceTemplates from "@src/__mocks__/mockedDb/serviceTemplates";
import AccessConditions from "@src/__mocks__/mockedDb/accessConditions";
import Steps from "@src/__mocks__/mockedDb/steps";
import StepsMedia from "@src/__mocks__/mockedDb/stepsMedia";

import app from "@src/app";

beforeAll(async () => {
  await ServiceTemplates.insert({
    id: 1,
    name: "My service",
    config: JSON.stringify({ quests: [{ name: "quest1" }] }),
  });
  await ServiceTemplates.insert({
    id: 2,
    name: "My service with two quests",
    config: JSON.stringify({
      quests: [{ name: "quest1" }, { name: "quest2" }],
    }),
  });

  await ServiceTemplates.insert({
    id: 3,
    name: "My service with access condition",
    config: JSON.stringify({
      quests: [
        {
          name: "quest1",
          accessConditions: [
            { type: "timeLimit", value: "2022-01-01T00:00:00.000Z+02:00" },
          ],
        },
      ],
    }),
  });
  await ServiceTemplates.insert({
    id: 4,
    name: "My service with a media step",
    config: JSON.stringify({
      quests: [
        {
          name: "quest1",
          accessConditions: [
            { type: "timeLimit", value: "2022-01-01T00:00:00.000Z+02:00" },
          ],
          steps: [
            {
              type: "media",
              description: "This is a step description",
              fileTypes: ["image/png", "video/mp4"],
            },
          ],
        },
      ],
    }),
  });
});

afterAll(async () => {
  await ServiceTemplates.clear();
});

describe("POST /services", () => {
  afterEach(async () => {
    await Services.clear();
    await Quests.clear();
    await AccessConditions.clear();
    await Steps.clear();
    await StepsMedia.clear();
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
  it("should create a service with a quest with access condition if the template has the configuration for it", async () => {
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 3 })
      .set("authorization", "valid");
    const service = await Services.first();
    expect(service).not.toBeNull();
    const quest = await Quests.first(undefined, [{ service_id: service.id }]);
    expect(quest).not.toBeNull();
    const accessConditions = await AccessConditions.all(undefined, [
      { quest_id: quest.id },
    ]);
    expect(accessConditions.length).toBe(1);
    expect(accessConditions[0].type).toBe("timeLimit");
    expect(accessConditions[0].value).toBe("2022-01-01T00:00:00.000Z+02:00");
  });
  it("should create a service with a quest with a media step if the template has the configuration for it", async () => {
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 4 })
      .set("authorization", "valid");
    const service = await Services.first();
    expect(service).not.toBeNull();
    const quest = await Quests.first(undefined, [{ service_id: service.id }]);
    expect(quest).not.toBeNull();
    const steps = await Steps.all(undefined, [{ quest_id: quest.id }]);
    expect(steps.length).toBe(1);
    expect(steps[0].type).toBe("media");
    const stepsMediaConfiguration = await StepsMedia.all(undefined, [
      { step_id: steps[0].id },
    ]);
    expect(stepsMediaConfiguration.length).toBe(1);
    expect(stepsMediaConfiguration[0].file_types).toBe("image/png,video/mp4");
  });
  it("should create a service with a quest with a step with description if there is a configuration for it", async () => {
    await request(app)
      .post("/services")
      .send({ name: "New service", templateId: 4 })
      .set("authorization", "valid");
    const service = await Services.first();
    expect(service).not.toBeNull();
    const quest = await Quests.first(undefined, [{ service_id: service.id }]);
    expect(quest).not.toBeNull();
    const steps = await Steps.all(undefined, [{ quest_id: quest.id }]);
    expect(steps.length).toBe(1); //
    console.log(steps[0]);
    expect(steps[0].description).toBe("This is a step description");
  });
});
