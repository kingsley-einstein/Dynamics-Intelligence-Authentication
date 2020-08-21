import { expect } from "chai";
import request from "supertest";
import { Authentication } from "../db";
import app from "..";

const API_ROOT = "/api/v1/auth";
let token = "";

const firstName = "Adolph";
const lastName = "Sequia";
const phoneNumber = "+44-9837773636";
const password = "testpassword";
const email = "adolphsequia@app.com";

describe("TESTS", () => {
 describe("AUTHENTICATION TESTS WITH SUCCESS RESPONSES", () => {
  it("should create user", (done) => {
   request(app)
    .post(API_ROOT + "/create")
    .send({ firstName, lastName, phoneNumber, password, email })
    .end((err, res) => {
     console.table([res.body.response]);
     expect(res.status).to.be.eql(201);
     done(err);
    });
  });
  it("should log user in", (done) => {
   request(app)
    .post(API_ROOT + "/login")
    .send({ email, password })
    .end((err, res) => {
     console.table([res.body.response]);
     token = res.body.response.token;
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should get logged in user", (done) => {
   request(app)
    .get(API_ROOT + "/getloggeduser")
    .set("Authorization", `Bearer ${token}`)
    .end((err, res) => {
     console.table([res.body.response]);
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should update user detail", (done) => {
   request(app)
    .patch(API_ROOT + "/update")
    .send({ password: "thisisanotherpassword" })
    .set("Authorization", `Bearer ${token}`)
    .end((err, res) => {
     console.table([res.body.response]);
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should still log user in when detail has been changed", (done) => {
   request(app)
    .post(API_ROOT + "/login")
    .send({ email, password: "thisisanotherpassword" })
    .end((err, res) => {
     console.table([res.body.response]);
     token = res.body.response.token;
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should log user out", (done) => {
   request(app)
    .get(API_ROOT + "/logout")
    .set("Authorization", `Bearer ${token}`)
    .end((err, res) => {
     console.table([res.body.response]);
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
  it("should get users", (done) => {
   request(app)
    .get(API_ROOT + "/users")
    .end((err, res) => {
     console.table(res.body.response);
     expect(res.status).to.be.eql(200);
     done(err);
    });
  });
 });
 describe("AUTHENTICATION TESTS WITH ERROR RESPONSES", () => {
  it("should respond with a 400 if user with email is already registered", (done) => {
   request(app)
    .post(API_ROOT + "/create")
    .send({ email, firstName, lastName, phoneNumber, password })
    .end((err, res) => {
     console.table([res.body]);
     expect(res.status).to.be.eql(400);
     done(err);
    });
  });
  it("should respond with a 401 if auth header is null", (done) => {
   request(app)
    .get(API_ROOT + "/getloggeduser")
    .end((err, res) => {
     console.table([res.body]);
     expect(res.status).to.be.eql(401);
     done(err);
    });
  });
 });
 after((done) => {
  Authentication.model.deleteMany({}).then(() => {
   done();
  });  
 });
});
