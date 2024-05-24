import express from "express";
import { AppDataSource } from "./db/db.config";
import bodyParser from "body-parser";
import userRouter from "./routers/user.router";
import productRouter from "./routers/product.router";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Connecting to the database
AppDataSource.initialize().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
    app.use('/',userRouter) ;
    app.use('/product',productRouter) ;
}).catch((err) => {
    console.error(err);
});
