import AccessCondition from "./AccessCondition";

class TimedAccessCondition extends AccessCondition {
  public getCondition() {
    return {
      type: "timed" as "timed",
      endDate: this.value,
    };
  }
}

export default TimedAccessCondition;
