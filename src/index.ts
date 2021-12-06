import Express from 'express'
import dotenv from 'dotenv';
dotenv.config();

const app = Express();


app.listen(process.env.PORT, () => {
    console.log("Application running")
})