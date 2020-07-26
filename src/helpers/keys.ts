export class Keys {
 static checkIfPresent(body: any, keys: string[]): boolean {
  return Object.keys(body).every((bodykey) => {
   return keys.some((key) => key === bodykey);
  });
 }
}
