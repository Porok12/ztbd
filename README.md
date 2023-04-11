

# PostgreSQL

```
docker run -d --rm --name ztbd-postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -v ~/ztbd/postgres:/var/lib/postgresql/data postgres:latest
```

Username: `postgres`

Password: `postgres`

# MongoDB

```
docker run -d --rm --name ztbd-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mongo -v ~/ztbd/mongo:/etc/mongo mongo:latest
```

Username: `mongo`

Password: `mongo`

# Cassandra

```
docker run -d --rm --name ztbd-cassandra -p 9042:9042 -e CASSANDRA_PASSWORD=cassandra -v ~/ztbd/cassandra:/var/lib/cassandra -v $(git rev-parse --show-toplevel)/config/cassandra.yaml:/etc/cassandra/cassandra.yaml cassandra:latest
```

Username: `cassandra`

Password: `cassandra`

NOTE: Using custom config is required as it modifies `batch_size_fail_threshold`