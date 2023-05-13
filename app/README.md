Install dependencies

```shell
$ npm ci # in 'app' folder
$ npm ci # in 'ui' folder
```

Build frontend:
```shell
# in ui folder
$ npm run build
# or use
$ npm run start # for live development
```

Start the server:
```shell
$ npm run start
# or 
$ npm run dev # for life development
```

Requirements:

* `node` installed (https://github.com/nvm-sh/nvm)

```shell
$ node src/model/cassandra.js
$ node src/model/mongo.js
$ node src/model/psql.js
```
