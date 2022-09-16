import * as db from "@src/features/db";
class Database<T extends Record<"fields", Record<string, number | string>>> {
  private table: string;
  private primaryKey: string;
  private fields: (keyof T["fields"])[];
  private example: T["fields"] | undefined;
  constructor({
    table,
    primaryKey,
    example,
  }: {
    table: string;
    primaryKey: string;
    example?: T["fields"];
  }) {
    this.table = table;
    this.primaryKey = primaryKey;
    this.example = example;
    this.fields = example ? Object.keys(example) : ["*"];
  }

  public name() {
    return this.table;
  }

  public defaultItem() {
    if (!this.example) throw new Error("No example provided");
    return this.example;
  }

  public columns() {
    if (!this.example) throw new Error("No example provided");
    const example = this.example;
    const columns = Object.keys(example).map((f) => {
      const type = typeof example[f];
      const field = f.toString();
      switch (type) {
        case "string":
          return { field, type: "VARCHAR(255)" };
        case "number":
          return { field, type: "INTEGER" };
        default:
          throw new Error(`Invalid type ${type}`);
      }
    });

    return columns.map(
      ({ field, type }) =>
        `${field} ${type}${
          field === this.primaryKey ? " PRIMARY KEY AUTOINCREMENT" : ""
        }`
    );
  }

  public async get(id: number): Promise<T["fields"]> {
    const result = await this.query({
      where: [{ [this.primaryKey]: id }],
      limit: 1,
    });
    if (result.length === 0) {
      throw new Error(`No ${this.table} with id ${id}`);
    }
    return result[0];
  }

  public async exists(id: number): Promise<boolean> {
    const result = await this.query({
      where: [{ [this.primaryKey]: id }],
      limit: 1,
    });
    return result.length > 0;
  }

  public query({
    where,
    limit,
    offset,
  }: {
    where?: {}[];
    limit?: number;
    offset?: number;
  }) {
    const sql = this.constructSelectQuery({ where, limit, offset });
    return db.query(sql);
  }

  public async update({
    data,
    where,
  }: {
    data: Partial<T["fields"]>;
    where: Partial<T["fields"]>[];
  }) {
    const sql = this.constructUpdateQuery({ data, where });
    await db.query(sql);
  }

  public async insert(
    data: Partial<T["fields"]>
  ): Promise<{ insertId: number }> {
    const sql = this.constructInsertQuery({ data });
    return await db.query(sql);
  }

  public async delete(where: Partial<T["fields"]>[]) {
    const sql = this.constructDeleteQuery({ where });
    await db.query(sql);
  }

  private constructSelectQuery({
    where,
    limit,
    offset,
  }: {
    where?: {}[];
    limit?: number;
    offset?: number;
  }) {
    if (offset && !limit) {
      throw new Error("Offset without limit");
    }
    return `SELECT ${this.fields.join(",")} FROM ${this.table} ${
      where ? this.constructWhereQuery(where) : ""
    } ${limit ? `LIMIT ${limit}` : ""} ${offset ? `OFFSET ${offset}` : ""}`;
  }

  private constructUpdateQuery({
    data,
    where,
  }: {
    data: Partial<T["fields"]>;
    where?: {}[];
  }) {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    const sql = db.format(
      `UPDATE ${this.table} SET ${dataKeys
        .map((key) => `${key} = ?`)
        .join(",")} ${where ? this.constructWhereQuery(where) : ""}`,
      dataValues
    );
    return sql;
  }

  private constructInsertQuery({ data }: { data: Partial<T["fields"]> }) {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    const sql = db.format(
      `INSERT INTO ${this.table} (${dataKeys
        .map((key) => `${key}`)
        .join(",")}) VALUES (${dataValues.map((value) => `?`).join(",")})`,
      dataValues
    );
    return sql;
  }

  private constructDeleteQuery({ where }: { where?: Partial<T["fields"]>[] }) {
    return `DELETE FROM ${this.table} ${
      where ? this.constructWhereQuery(where) : ""
    } `;
  }

  protected constructWhereQuery(
    where?: (Partial<T["fields"]> | Partial<T["fields"]>[])[]
  ) {
    if (typeof where === "undefined") return "";

    const orQueries = where.map((item) => {
      let ors = item;
      if (!Array.isArray(item)) {
        ors = [item];
      }
      if (!Array.isArray(ors)) throw new Error("Undefined where");
      return `(${ors
        .map((subItem) => {
          const key = Object.keys(subItem)[0];
          const value = Object.values(subItem)[0] as string | number;
          return db.format(`${key} = ?`, [value]);
        })
        .join(" OR ")})`;
    });
    return `WHERE ${orQueries.join(" AND ")}`;
  }
}

export default Database;
