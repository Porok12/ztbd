import express from "express";
import path from "path";
import {testcase1} from "./src/controllers/testcase1.js";
import {testcase2} from "./src/controllers/testcase2.js";
import {testcase3} from "./src/controllers/testcase3.js";
import {testcase4} from "./src/controllers/testcase4.js";
import {testcase5} from "./src/controllers/testcase5.js";
import {testcase6} from "./src/controllers/testcase6.js";
import {queryData} from "./src/controllers/query.js";

const app = express();

const port = process.env.port || 3500;
const __dirname = path.resolve(path.dirname(''));
const publicPath = path.join(__dirname, 'ui', 'build');

app.use(express.static(publicPath));

app.get('/testcase1', testcase1);
app.get('/testcase2', testcase2);
app.get('/testcase3', testcase3);
app.get('/testcase4', testcase4);
app.get('/testcase5', testcase5);
app.get('/testcase6', testcase6);
app.get('/query', queryData);

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port);

console.log(`Running at http://localhost:${port}`);
