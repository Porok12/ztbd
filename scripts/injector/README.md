
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

# Example

```shell
$ python3 ./main.py -f ~/Downloads/wetransfer/weather2.csv --init --dbms mongo --batch 1024 --city 0 # 02:58 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather3.csv --dbms mongo --batch 2048 --city 1 # 02:42 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather4.csv --dbms mongo --batch 512 --city 2  # 03:42 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather5.csv --dbms mongo --batch 1024 --city 3

$ python3 ./main.py -f ~/Downloads/wetransfer/weather2.csv --init --dbms postgres --batch 1024 --city 0 # 05:04 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather3.csv --dbms postgres --batch 2048 --city 1 # 06:19 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather4.csv --dbms postgres --batch 512 --city 2  # 04:10 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather5.csv --dbms postgres --batch 512 --city 3

$ python3 ./main.py -f ~/Downloads/wetransfer/weather2.csv --init --dbms cassandra --batch 512 --city 0 # 13:25 min
$ python3 ./main.py -f ~/Downloads/wetransfer/weather3.csv --dbms cassandra --batch 512 --city 1
$ python3 ./main.py -f ~/Downloads/wetransfer/weather4.csv --dbms cassandra --batch 512 --city 2
$ python3 ./main.py -f ~/Downloads/wetransfer/weather5.csv --dbms cassandra --batch 512 --city 3
```