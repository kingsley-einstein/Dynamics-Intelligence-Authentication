import jwt from "jsonwebtoken";
import { Environment } from "../env";

export class JWT {
 static encode(payload: any): string {
  return jwt.sign({ ...payload }, Environment.JWT_SECRET, {
   expiresIn: "7d"
  });
 }

 static decode(token: string): any {
  return jwt.decode(token);
 }
}
