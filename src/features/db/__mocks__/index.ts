import sqlite from "@src/features/sqlite";
import mysql from "mysql";

export const format = (query: string, data: (string | number)[]) =>
  mysql.format(query.replace(/"/g, "'"), data).replace(/\\"/g, '"');

export const query = async (query: string): Promise<any> => {
  try {
    let data;
    if (
      query.includes("UPDATE") ||
      query.includes("DELETE") ||
      query.includes("INSERT")
    ) {
      data = await sqlite.run(query);
      if (data.hasOwnProperty("lastInsertRowid")) {
        data.insertId = data.lastInsertRowid;
      }
      if (data.hasOwnProperty("changes") && query.includes("UPDATE")) {
        data.changedRows = data.changes;
      }
      if (data.hasOwnProperty("changes") && query.includes("DELETE")) {
        data.affectedRows = data.changes;
      }
    } else {
      data = await sqlite.all(query);
    }
    return data;
  } catch (error) {
    if ((error as { code: string }).code === "SQLITE_CONSTRAINT_UNIQUE") {
      (error as { code: string }).code = "ER_DUP_ENTRY";
    }
    throw error;
  }
};

export const insert = (table: string, data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const sql = "INSERT INTO ?? SET ?";
    const query = mysql.format(sql, [table, data]);
    try {
      const data = await sqlite.run(query);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
