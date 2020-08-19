import mongoose from "mongoose";

export class TokenModel {
 model: mongoose.Model<mongoose.Document, {}>;

 constructor() {
  this.define();
 }

 define(): void {
  this.model = mongoose.model("Token", new mongoose.Schema({
   sessionId: {
    type: String,
    required: true
   }
  }));
 }

 invalidate(sessionId: string): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.create({ sessionId })
  );
 }

 async isInvalid(sessionId: string): Promise<boolean> {
  const t = await this.model.findOne({ sessionId });
  return Promise.resolve(!t ? false: true);
 }
}
