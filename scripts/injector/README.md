
# Inject data to DBMS

```shell
$ python3 ./main.py -f ../webscraping/weather.csv --dbms mongo,postgres,cassandra
```

## Postgres

* create `weather_db` database
  ```sql
  CREATE DATABASE weather_db
  ```
* create `warsaw` table
  ```sql
  CREATE TABLE warsaw (id serial PRIMARY KEY, data text)
  ```

## Cassandra

* create `weather_db` keyspace
  ```sql
  CREATE KEYSPACE weather_db WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};
  ```
* create table `warsaw`
  ```sql
  CREATE TABLE warsaw (id UUID PRIMARY KEY, data text)
  ```