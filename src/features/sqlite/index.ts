const sqlite3 = require("better-sqlite3");

const db = new sqlite3(":memory:");
db.function("NOW", () =>
  new Date().toISOString().split(".")[0].replace("T", " ")
);
db.function("MONTH", (args: string) => parseInt(args.split("-")[1]));
db.function("YEAR", (args: string) => parseInt(args.split("-")[0]));
db.function("CONCAT", { varargs: true }, (...args: string[]) => args.join(""));
db.function("COALESCE", { varargs: true }, (...args: string[]) =>
  (args.find((a: any) => a) || null)?.toString()
);

const mockDb: any = {};

mockDb.createTable = (table: string, columns: string[]) => {
  return new Promise(async (resolve, reject) => {
    const query = `CREATE TABLE IF NOT EXISTS ${table} (${columns.join(
      ", "
    )});`;

    try {
      await db.exec(query);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
mockDb.dropTable = (table: string) => {
  return new Promise(async (resolve, reject) => {
    const query = `DROP TABLE IF EXISTS ${table};`;
    try {
      await db.exec(query);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

mockDb.all = (query: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.prepare(query.replace(/"/g, "'")).all();
      resolve(data);
    } catch (err) {
      console.log(query);
      console.log("error SQLITE:");
      reject(err);
    }
  });
};
mockDb.get = (query: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const data = await db.prepare(query).get();
    resolve(data);
  });
};

mockDb.run = (query: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const data = await db.prepare(query).run();
    resolve(data);
  });
};

mockDb.insert = async (table: string, data: any): Promise<any> => {
  const sql = `INSERT INTO ${table} (${Object.keys(data)
    .map((d) => d)
    .join(",")}) VALUES (${Object.keys(data)
    .map(() => "?")
    .join(",")});`;
  return await db.prepare(sql).run(...Object.values(data));
};

export default mockDb;
