import dotenv from "dotenv";

dotenv.config();
export default (message: any) => {
  if (process.env && process.env.DEBUG) {
    console.log(message);
  }
};
