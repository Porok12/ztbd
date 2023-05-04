import express from "express";
const app = express();
import path from "path";
const router = express.Router();
import cors from "cors";
import {countTimeMongo, countTime, countTimeCassandra} from "./src/controllers/controller.js"

const __dirname = path.resolve(path.dirname(''));

app.use(cors())

router.get("/", (req, res) => {
    res.send("Server");
});

router.route('/test3').get(countTimeCassandra)
router.route('/test2').get(countTimeMongo);
router.route('/test').get(countTime);

app.use("/", router);
app.use("/test3", router);
app.use("/test2", router);
app.use("/test", router);


app.get('*', function (req, res) {
    res.send('ERR 404', 404);
});

app.listen(process.env.port || 3500);

console.log("Running at Port 3500");