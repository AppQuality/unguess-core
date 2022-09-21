import AccessCondition from "./AccessCondition";

class TesterListAccessCondition extends AccessCondition {
  public getCondition() {
    return {
      type: "testerlist" as "testerlist",
      list: this.value.split(",").map((i) => parseInt(i)),
    };
  }
}

export default TesterListAccessCondition;
