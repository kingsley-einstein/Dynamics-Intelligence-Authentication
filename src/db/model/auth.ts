import mongoose from "mongoose";
import { Hash } from "../../helpers";

export class AuthModel {
 public model: mongoose.Model<mongoose.Document, {}>;
 
 constructor() {
  this.define();
 }

 define(): void {
  // Create schema
  const schema = new mongoose.Schema({
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
    required: true,
    unique: {
     message: "Email already registered."
    }
   },
   password: {
    type: String,
    required: true
   },
   phoneNumber: {
    type: String,
    required: true
   },
   isVerified: {
    type: Boolean,
    default: false
   }
  });

  // Instantiate a variable as the global "this"
  const that = this;

  // Define "pre" hooks on model
  schema.pre("save", function(next) {
   const doc = this as mongoose.Document & { password: string; };
   if (doc.isModified("password"))
    doc.password = Hash.create(doc.password);
   next();
  });

  // schema.pre("findOneAndUpdate", async function(next) {
  //  const doc = await that.model.findOne(this.getFilter()) as mongoose.Document & { password: string; };
  //  if (doc.isModified("password"))
  //   doc.password = Hash.create(doc.password);
  //  next();
  // });

  this.model = mongoose.model("User", schema);
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

 getByEmail(email: string): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.findOne({ email })
  );
 }

 getAll(): Promise<Array<mongoose.Document>> {
  return Promise.resolve(
   this.model.find()
  );
 }

 updateAuthById(_id: any, update: any): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.findByIdAndUpdate(_id, update, {
    new: true
   })
  );
 }

 deleteById(_id: any): Promise<mongoose.Document> {
  return Promise.resolve(
   this.model.findByIdAndDelete(_id)
  );
 }
}
