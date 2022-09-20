class AccessCondition {
  constructor(protected value: string) {}
  public getCondition() {
    throw new Error("Not implemented");
  }
}

export default AccessCondition;
