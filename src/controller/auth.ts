import express from "express";
import { v4 as uuid } from "uuid";
import { Authentication, JWTs } from "../db";
import { JWT, Hash } from "../helpers";
import { CustomError } from "../_custom_";

export class AuthController {
 static async create(req: express.Request, res: express.Response): Promise<any> {
  try {
   // Create user
   const user = await Authentication.create(req.body) as any;

   // API response
   const response = {
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber,
    token: JWT.encode({
     email: user.email,
     fullName: `${user.firstName} ${user.lastName}`,
     phoneNumber: user.phoneNumber,
     password: user.password,
     sessionId: uuid()
    }) 
   };

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
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber,
    token: JWT.encode({
     email: user.email,
     fullName: `${user.firstName} ${user.lastName}`,
     phoneNumber: user.phoneNumber,
     password: user.password,
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
   const { email, fullName, sessionId, phoneNumber } = req.user;

   //API response
   const response = {
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
     phoneNumber: user.phoneNumber
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
}
