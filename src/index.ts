import Express from 'express'
import dotenv from 'dotenv';
import router from './controllers';
dotenv.config();


const app = Express();


app.use(router);


app.get("/health", () => {
    console.log("Application is running well")
})

app.listen(process.env.PORT, () => {
    console.log("Application running")
})


