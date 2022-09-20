import jest from "jest";
import Database from "./Database";

class TestableDatabase extends Database<{
  fields: { id: number; name: string };
}> {
  constructor(example?: TestableDatabase["example"]) {
    super({
      table: "test",
      primaryKey: "id",
      example: example ? example : { id: 1, name: "test" },
    });
  }

  public testWhereQuery(
    args?: Parameters<TestableDatabase["constructWhereQuery"]>[0]
  ) {
    return this.constructWhereQuery(args);
  }
}
describe("Database connector class", () => {
  it("Should allow creating an empty where query", () => {
    const db = new TestableDatabase();
    const sql = db.testWhereQuery();
    expect(sql).toBe("");
  });
  it("Should allow creating a where clause with ANDs", () => {
    const db = new TestableDatabase();
    const sql = db.testWhereQuery([{ id: 1 }, { name: "test" }]);
    expect(sql).toBe("WHERE (id = 1) AND (name = 'test')");
  });
  it("Should allow creating a where clause with ORs", () => {
    const db = new TestableDatabase();
    const sql = db.testWhereQuery([[{ id: 1 }, { name: "test" }]]);
    expect(sql).toBe("WHERE (id = 1 OR name = 'test')");
  });
  it("Should allow creating a where clause with ORs and ANDs", () => {
    const db = new TestableDatabase();
    const sql = db.testWhereQuery([[{ id: 1 }, { id: 2 }], [{ name: "test" }]]);
    expect(sql).toBe("WHERE (id = 1 OR id = 2) AND (name = 'test')");
  });

  it("Should allow creating a where with IN list", () => {
    const db = new TestableDatabase();
    expect(db.testWhereQuery([{ id: [1, 2] }])).toBe("WHERE (id IN (1,2))");
    expect(db.testWhereQuery([{ name: ["test1", "test2"] }])).toBe(
      "WHERE (name IN ('test1','test2'))"
    );
  });
});
