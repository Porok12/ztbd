
Collect data to mongodb

```shell
$ python3 ./main.py -u mongo -p mongo --dbms mongo
```

Collect data to postgres

```shell
$ python3 ./main.py -u postgres -p postgres --dbms postgres
```

* create `weather_db` database
  ```sql
  CREATE DATABASE weather_db
  ```
* create `warsaw` table
  ```sql
  CREATE TABLE warsaw (id serial PRIMARY KEY, data text)
  ```

Collect data to cassandra

```shell
$ python3 ./main.py -u cassandra -p cassandra --dbms cassandra
```

* create `weather_db` keyspace
  ```sql
  CREATE KEYSPACE weather_db WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};
  ```
* create table `warsaw`
  ```sql
  CREATE TABLE warsaw (id UUID PRIMARY KEY, data text)
  ```