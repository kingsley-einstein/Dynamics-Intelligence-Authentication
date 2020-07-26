import jwt from "jsonwebtoken";

export class JWT {
 static encode(payload: any): string {
  return jwt.sign({...payload}, "", {
   expiresIn: "7d"
  });
 }

 static decode(token: string): object | string {
  return jwt.verify(token, "");
 }
}
