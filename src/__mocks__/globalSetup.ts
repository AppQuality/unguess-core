import Quests from "./mockedDb/quests";
import ServiceTemplates from "./mockedDb/serviceTemplates";
import AccessConditions from "./mockedDb/accessConditions";
import Service from "./mockedDb/service";
import Steps from "./mockedDb/steps";
import StepsMedia from "./mockedDb/stepsMedia";
import Results from "./mockedDb/results";
import ResultsMedia from "./mockedDb/resultsMedia";
import ResultsMediaComments from "./mockedDb/resultsMediaComments";

export {};
beforeAll(async () => {
  AccessConditions.mock();
  Quests.mock();
  Service.mock();
  ServiceTemplates.mock();
  Steps.mock();
  StepsMedia.mock();
  Results.mock();
  ResultsMedia.mock();
  ResultsMediaComments.mock();
});
