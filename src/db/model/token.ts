import mongoose from "mongoose";

export class TokenModel {
 schema: mongoose.Schema;
 model: mongoose.Model<mongoose.Document, {}>;

 constructor() {
  this.define();
 }

 define(): void {
  this.schema = new mongoose.Schema({
   token: {
    type: String,
    required: true
   }
  });

  this.model = mongoose.model("Token", this.schema);
 }

 invalidate(token: string): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.create({ token })
  );
 }

 async isInvalid(token: string): Promise<boolean> {
  const t = await this.model.findOne({ token });
  return Promise.resolve(!t ? false: true);
 }
}
