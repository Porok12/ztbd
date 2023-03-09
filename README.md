

# PostgreSQL

```
docker run -d --rm --name ztbd-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -v ~/ztbd/postgres:/var/lib/postgresql/data postgres:latest
```

Username: `postgres`

Password: `postgres`

# MongoDB

```
docker run -d --rm --name ztbd-mongo -p 27017:27017 -v ~/ztbd/mongo:/etc/mongo mongo:latest
```

NoAuth

# Cassandra

```
docker run -d --rm --name ztbd-cassandra -p 9042:9042 -e CASSANDRA_PASSWORD=cassandra -v ~/ztbd/cassandra:/var/lib/cassandra cassandra:latest
```

Username: `cassandra`

Password: `cassandra`

