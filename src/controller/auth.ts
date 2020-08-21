import express from "express";
import { v4 as uuid } from "uuid";
import nodemailer from "nodemailer";
import { Authentication, JWTs } from "../db";
import { JWT, Hash } from "../helpers";
import { CustomError } from "../_custom_";
import { Environment } from "../env";

const transport = nodemailer.createTransport({
 host: Environment.MAIL_HOST,
 port: parseInt(Environment.MAIL_PORT),
 auth: Environment.MAIL_AUTH
});

export class AuthController {
 static async create(req: express.Request, res: express.Response): Promise<any> {
  try {
   // Create user
   const user = await Authentication.create(req.body) as any;

   // API response
   const response = {
    id: user._id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber,
    verified: user.isVerified,
    token: JWT.encode({
     id: user._id,
     email: user.email,
     fullName: `${user.firstName} ${user.lastName}`,
     phoneNumber: user.phoneNumber,
     password: user.password,
     verified: user.isVerified,
     sessionId: uuid()
    })
   };

   // Send verification mail
   const mail = await transport.sendMail({
    to: response.email,
    subject: "Email Verification",
    html: `You signed up to use the Dynamic Intelligence app. If this wasn't you, please ignore. <a href="${req.get("host")}/verify?token=${response.token}">Click here to confirm email.</a>`
   });

   // Log message id
   console.log(mail.messageId);

   // Send response
   res.status(201).json({
    statusCode: 201,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async verify(req: express.Request, res: express.Response): Promise<any> {
  try {
   // Get token query parameter
   const token: any = req.query.token;
   
   // Decode payload
   const payload = JWT.decode(token);

   // Throw error is payload was not decoded
   if (!payload)
    throw new CustomError(400, "Token expired or malformed");
   
   // Find user with payload id
   const user: any =  await Authentication.getById(payload.id);

   // Throw error if user is already verified
   if (user.isVerified)
    throw new CustomError(400, "User is already verified");

   // Verify user
   const verifiedUser: any = await Authentication.updateAuthById(payload.id, {
    isVerified: true
   });

   // API response
   const response = {
    message: "Successfully verified user",
    user: {
     verified: verifiedUser.isVerified,
     email: verifiedUser.email,
     fullName: `${verifiedUser.firstName} ${verifiedUser.lastName}`,
     phoneNumber: verifiedUser.phoneNumber,
     id: verifiedUser._id
    }
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }

 static async requestNewVerificationLink(req: express.Request, res: express.Response): Promise<any> {
  try {
   // Find user
   const user: any = await Authentication.getByEmail(req.body.email);

   // Sign a new token
   const token = JWT.encode({
    id: user._id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber,
    verified: user.isVerified,
    sessionId: uuid()
   });

   // Send mail
   const mail = await transport.sendMail({
    to: user.email,
    subject: "Email Verification Link",
    html: `<a href="${req.get("host")}/verify?token=${token}">Click here to verify your email</a>`
   });

   // API response
   const response = {
    messageId: mail.messageId
   }

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async login(req: express.Request, res: express.Response): Promise<any> {
  try {
   // Find user by email
   const user = await Authentication.getByEmail(req.body.email) as any;

   // Throw error is user was not found
   if (!user)
    throw new CustomError(404, "User not found");

   // Throw error if user password does not match that in database
   if (!Hash.compare(req.body.password, user.password))
    throw new CustomError(400, "Password is incorrect");
   
   // API response
   const response = {
    id: user._id,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber,
    verified: user.isVerified,
    token: JWT.encode({
     id: user._id,
     email: user.email,
     fullName: `${user.firstName} ${user.lastName}`,
     phoneNumber: user.phoneNumber,
     password: user.password,
     verified: user.isVerified,
     sessionId: uuid()
    }) 
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }

 static async getUserWithSession(req: express.Request & { user: any; }, res: express.Response): Promise<any> {
  try {
   // Get user details from request
   const { id, email, fullName, sessionId, phoneNumber } = req.user;

   //API response
   const response = {
    id,
    email,
    fullName,
    sessionId,
    phoneNumber
   };
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async getAllUsers(req: express.Request, res: express.Response): Promise<any> {
  try {
   // Query db for users
   const users: Array<any> = await Authentication.getAll();

   // API response
   const response = users.map((user) => {
    return {
     email: user.email,
     fullName: `${user.firstName} ${user.lastName}`,
     phoneNumber: user.phoneNumber,
     id: user._id
    };
   });

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async logout(req: express.Request & { user: any; }, res: express.Response): Promise<any> {
  try {
   // Invalidate session
   const invalidSession = await JWTs.invalidate(req.user.sessionId);

   // Send response
   res.status(200).json({
    statusCode: 200,
    response: invalidSession
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }

 static async updateUser(req: express.Request & { user: any }, res: express.Response): Promise<any> {
  try {
   // Get user id
   const { id } = req.user;

   // Hash password if the password field is present in the request body
   if (req.body.password)
    req.body.password = Hash.create(req.body.password);

   // Update user
   const user: any = await Authentication.updateAuthById(id, req.body);

   // API response
   const response = {
    email: user.email,
    id: user._id,
    fullName: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber
   };

   // Send response
   res.status(200).json({
    statusCode: 200,
    response
   });
  } catch (error) {
   res.status(500).json({
    statusCode: 500,
    response: error.message
   });
  }
 }
}
