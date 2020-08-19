import express from "express";
import configure from "./config";

const app: express.Application = express();
const port: number = parseInt(process.env.PORT || "4000");

configure(app);

app.listen(port, () => {
 console.log(`Server running on ${port}`);
});

export default app;
