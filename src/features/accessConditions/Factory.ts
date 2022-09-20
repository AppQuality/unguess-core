import TimedAccessCondition from "./TimedAccessCondtion";

class AccessConditionFactory {
  public static create(type: string, value: string) {
    switch (type) {
      case "timed":
        return new TimedAccessCondition(value);
      default:
        throw new Error("Unknown access condition type");
    }
  }
}

export default AccessConditionFactory;
