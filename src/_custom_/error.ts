export class CustomError extends Error {
 public c: number;

 constructor(c: number, message: string) {
  super(message);
  this.c = c;
 }
}
