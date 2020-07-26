import express from "express";

export const SendError = (error: any, res: express.Response): express.Response => {
 return res.status(error.code || 500).json({
  code: error.code || 500,
  response: error.message
 });
};
