import dotenv from "dotenv";

dotenv.config();
const config: {
  port: string;
  apiRoot: false | string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  validTokens: string[];
} = {
  port: process.env.PORT || "3000",
  apiRoot: false,
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tryber",
  },
  validTokens: process.env.TOKENS ? process.env.TOKENS.split(",") : [],
};

if (process.env.API_ROOT) {
  config.apiRoot = process.env.API_ROOT || false;
}

export default config;
