import TimedAccessCondition from "./TimedAccessCondtion";
import TesterListAccessCondition from "./TesterListAccessCondition";

class AccessConditionFactory {
  public static create(type: string, value: string) {
    switch (type) {
      case "timed":
        return new TimedAccessCondition(value);
      case "testerlist":
        return new TesterListAccessCondition(value);
      default:
        throw new Error("Unknown access condition type");
    }
  }
}

export default AccessConditionFactory;
