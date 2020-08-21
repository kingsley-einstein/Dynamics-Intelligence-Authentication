import dotenv from "dotenv";

dotenv.config();

export class Environment {
 static JWT_SECRET = process.env.JWT_SECRET;
 static MAIL_HOST = process.env.MAIL_HOST;
 static MAIL_PORT = process.env.MAIL_PORT;
 static MAIL_AUTH = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS
 };
 static DB = {
  development: process.env.MONGO_MAIN_URI,
  production: process.env.MONGO_MAIN_URI,
  test: process.env.MONGO_TEST_URI
 };
}
