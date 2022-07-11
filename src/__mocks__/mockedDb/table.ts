import sqlite3 from "@src/features/sqlite";
class Table<T> {
  protected columns = ["id INTEGER PRIMARY KEY"];
  protected name = "my_table";
  constructor(public defaultItem: T) {
    this.defaultItem = defaultItem;
  }
  async mock() {
    await sqlite3.createTable(this.name, this.columns);
  }
  async dropMock() {
    await sqlite3.dropTable(this.name);
  }
  async insert(params?: T): Promise<T> {
    const item: T = {
      ...this.defaultItem,
      ...params,
    };
    await sqlite3.insert(this.name, item);
    return item;
  }
  async clear() {
    return await sqlite3.run(`DELETE FROM ${this.name}`);
  }
  async all(
    params?: (keyof T)[],
    where?: (T | T[])[],
    limit?: number
  ): Promise<T[]> {
    const keys = params ? params.join(",") : "*";
    let WHERE = "";
    if (where) {
      const orQueries = where.map((item) => {
        if (Array.isArray(item)) {
          return item
            .map(
              (subItem, index) =>
                `${Object.keys(subItem)[0]}='${Object.values(subItem)[0]}'`
            )
            .join(" OR ");
        }
        return item;
      });
      WHERE = `WHERE ${orQueries
        .map(
          (item, index) => `${Object.keys(item)[0]}='${Object.values(item)[0]}'`
        )
        .join(" AND ")}`;
    }
    return await sqlite3.all(
      `SELECT ${keys} FROM ${this.name} ${WHERE} ${
        limit ? `LIMIT ${limit}` : ""
      }`
    );
  }
  async first(params?: (keyof T)[], where?: (T | T[])[]): Promise<T> {
    const items = await this.all(params, where, 1);
    return items[0];
  }
}
export default Table;
