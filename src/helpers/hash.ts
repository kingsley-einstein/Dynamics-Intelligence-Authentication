import bcrypt from "bcryptjs";

export class Hash {
 static create(raw: string): string {
  return bcrypt.hashSync(
   raw, bcrypt.genSaltSync(14)
  );
 }

 static compare(raw: string, encoded: string): boolean {
  return bcrypt.compareSync(raw, encoded);
 }
}
