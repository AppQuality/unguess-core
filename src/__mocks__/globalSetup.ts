import Quests from "./mockedDb/quests";
import ServiceTemplates from "./mockedDb/serviceTemplates";
import AccessConditions from "./mockedDb/accessConditions";
import Service from "./mockedDb/service";
import Steps from "./mockedDb/steps";

export {};
beforeAll(async () => {
  AccessConditions.mock();
  Quests.mock();
  Service.mock();
  ServiceTemplates.mock();
  Steps.mock();
});
