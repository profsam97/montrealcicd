import express, {Express} from 'express'
import cors from 'cors'
import router from "./Routers/Router";
import connect from "./DB/connect";
const port : number | string=  process.env.PORT || 5000;
const app : Express = express();
// app.use(cors({origin: true}))
connect

app.use(express.json())

app.use(router)

app.listen(port, () => {
        console.log('Running on port ' + port);
});

export default app;