import express from "express";
import logger from "morgan";

export default (app: express.Application): void => {
 app.use(express.json());
 app.use(express.urlencoded({
  extended: false
 }));
 app.use(logger("dev"));
}
