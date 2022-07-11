import Quests from "./mockedDb/quests";
export {};
beforeAll(async () => {
  Quests.mock();
});
