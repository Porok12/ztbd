import express from "express";
import path from "path";
import {countTime, countTimeCassandra, countTimeMongo} from "./src/controllers/controller.js";
import {testcase1} from "./src/controllers/testcase1.js";
import {queryData} from "./src/controllers/query.js";

const app = express();

const port = process.env.port || 3500;
const __dirname = path.resolve(path.dirname(''));
const publicPath = path.join(__dirname, 'ui', 'build');

app.use(express.static(publicPath));

app.get('/test3', countTimeCassandra)
app.get('/test2', countTimeMongo);
app.get('/test', countTime);

app.get('/testcase1', testcase1);
app.get('/query', queryData);

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port);

console.log(`Running at http://localhost:${port}`);
