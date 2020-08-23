import express from "express";
import { Authentication, JWTs } from "../db";
import { JWT } from "../helpers";
import { CustomError } from "../_custom_";

export class AuthMiddleware {
 static async checkToken(req: express.Request & { user: any; }, res: express.Response, next: express.NextFunction) {
  try {
   // Get authorization header
   const authorization = req.headers.authorization;

   // Check if authorization header is null in which case an error would be thrown
   if (!authorization)
    throw new CustomError(401, "Authorization header not present in request");
   
    // Check if authorization header does not begin with a 'Bearer' string in which case throw a 401 error
    if (!authorization.startsWith("Bearer"))
     throw new CustomError(401, "Authorization header must begin with 'Bearer' string");
    
    // Extract token from the header
    const token = authorization.substring(7, authorization.length);

    // Throw an error if token is not found
    if (!token || token.trim().length === 0)
     throw new CustomError(401, "Token not found in authorization header");
    
    // Decode token
    const payload = JWT.decode(token);

    // Check if payload is null in which case it means there was an error during decrypting
    if (!payload)
     throw new CustomError(401, "Invalid or expired token. Sign in to sign another")

    // Check if session has been invalidated by sign out
    if (await JWTs.isInvalid(payload.sessionId))
     throw new CustomError(401, "Invalid session. Sign in again");

    // If payload was successfully decrypted, modify the request object
    req.user = payload;

    // Pass control to the next function
    next();
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }

 static async checkIfVerified(req: express.Request & { user: any; }, res: express.Response, next: express.NextFunction) {
  try {
   // Throw error if user is not verified
   if (!req.user.verified)
    throw new CustomError(400, "Only verified users can access this resource.");
   
   // Pass control to the next function
   next();
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }

 static async checkIfUserExists(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
   // Find user to see if they exist as members
   const user = await Authentication.getByEmail(req.body.email);

   // Throw error if user exists
   if (!!user)
    throw new CustomError(400, "User with email is already a member");
   
    // Pass control to the next function
    next();
  } catch (error) {
   res.status(error.c || 500).json({
    statusCode: error.c || 500,
    response: error.message
   });
  }
 }
}
