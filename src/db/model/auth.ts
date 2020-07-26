import mongoose from "mongoose";

export class AuthModel {
 schema: mongoose.Schema;
 model: mongoose.Model<mongoose.Document, {}>;
 
 constructor() {
  this.define();
 }

 define(): void {
  this.schema = new mongoose.Schema({
   firstName: {
    type: String,
    required: true
   },
   lastName: {
    type: String,
    required: true
   },
   email: {
    type: String,
    required: true
   },
   password: {
    type: String,
    required: true
   }
  });

  this.model = mongoose.model("User", this.schema);
 }

 create(body: any): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.create(body)
  );
 }

 getById(_id: any): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.findById(_id)
  );
 }

 getAll(): Promise<Array<mongoose.Document>> {
  return Promise.resolve(
   this.model.find()
  );
 }
}
