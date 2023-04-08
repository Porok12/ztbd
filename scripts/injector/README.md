
# Inject data to DBMS

```shell
# This will delete databases if exist (remove option --init to just insert data)
$ python3 ./main.py -f ../webscraping/weather.csv --dbms mongo,postgres,cassandra  --init
```

# Example queries

MongoDB
```
db.measurements.find({ temperature: { $gt: 49 } })
```

PostgreSQL
```
SELECT * FROM measurements WHERE temperature > 49
```

Cassandra
```
SELECT * FROM measurements WHERE temperature > 49 ALLOW FILTERING
```
