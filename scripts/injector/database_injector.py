import logging
from datetime import datetime
from enum import Enum
from typing import List, TypedDict
from functools import reduce

import psycopg
import pymongo
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster


class Record(TypedDict):
    date: str
    time: str
    temperature: float
    dew_point: float
    humidity: float
    wind: str
    wind_speed: float
    wind_gust: float
    pressure: float
    precip: float
    condition: str


class DMBS(Enum):
    Mongo = 'mongo'
    Postgres = 'postgres'
    Cassandra = 'cassandra'


class City(TypedDict):
    country: str
    city: str
    longitude: float
    latitude: float


cities: List[City] = [
    {
        'country': 'poland',
        'city': 'warsaw',
        'longitude': 21.017532,
        'latitude': 52.237049,
    },
    {
        'country': 'poland',
        'city': 'cracow',
        'longitude': 19.944544,
        'latitude': 50.049683,
    },
    {
        'country': 'poland',
        'city': 'wroclaw',
        'longitude': 17.0319771,
        'latitude': 51.1099804,
    },
    {
        'country': 'poland',
        'city': 'katowice',
        'longitude': 19.0133333,
        'latitude': 50.2597222,
    },
]


class DatabaseInjector:
    def __del__(self):
        if self._mongo_db:
            self._mongo_db.close()
        if self._postgres_db:
            self._postgres_db.close()
        if self._cassandra_db:
            self._cassandra_db.shutdown()

    def __init__(self, args):
        self._mongo_db = None
        self._postgres_db = None
        self._cassandra_db = None
        self._dbms: List[DMBS] = args.dbms
        self._city: int = args.city
        database_name = 'weather_db'
        measurements_table = 'measurements'
        cities_table = 'cities'

        if DMBS.Mongo.value in self._dbms:
            client = pymongo.MongoClient('localhost', 27017, username='mongo', password='mongo')
            # Mongo created collection automatically
            if args.init:
                logging.info('Initializing MONGO')
                client.drop_database('weather_db')
            self._mongo_db = client

        if DMBS.Postgres.value in self._dbms:
            if args.init:
                logging.info('Initializing POSTGRES')
                conn = psycopg.connect(
                    "host='127.0.0.1' port=5432 user='postgres' password='postgres' dbname='postgres'",
                    autocommit=True,
                )
                conn.execute("DROP DATABASE IF EXISTS weather_db")
                conn.execute("CREATE DATABASE weather_db")
                conn.close()
            conn = psycopg.connect(
                "host='127.0.0.1' port=5432 user='postgres' password='postgres' dbname='weather_db'",
                autocommit=True,
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS cities (
                    id SERIAL PRIMARY KEY,
                    country VARCHAR(32) NOT NULL,
                    city VARCHAR(32) NOT NULL,
                    longitude REAL NOT NULL,
                    latitude REAL NOT NULL
                )
                """
            )
            if args.init:
                logging.info('Initializing POSTGRES - cities')
                for idx, city in enumerate(cities):
                    # conn.execute("DROP TABLE IF EXISTS cities")
                    conn.execute(
                        """
                        INSERT INTO cities (id, country, city, longitude, latitude)
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (idx, city['country'], city['city'], city['longitude'], city['latitude'])
                    )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS measurements (
                    id SERIAL PRIMARY KEY,
                    date TIMESTAMP NOT NULL,
                    temperature REAL NOT NULL,
                    dew_point REAL NOT NULL,
                    humidity REAL NOT NULL,
                    wind VARCHAR(4) NOT NULL,
                    wind_speed REAL NOT NULL,
                    wind_gust REAL NOT NULL,
                    pressure REAL NOT NULL,
                    precip REAL NOT NULL,
                    condition VARCHAR(32) NOT NULL,
                    location INTEGER REFERENCES cities (id)
                )
                """
            )
            self._postgres_db = conn

        if DMBS.Cassandra.value in self._dbms:
            auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')
            cluster = Cluster(['127.0.0.1'], port=9042, auth_provider=auth_provider)
            if args.init:
                logging.info('Initializing CASSANDRA')
                session = cluster.connect()
                session.execute("DROP KEYSPACE IF EXISTS weather_db")
                session.execute(
                    """
                    CREATE KEYSPACE weather_db WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};
                    """
                )
                session.shutdown()
            session = cluster.connect('weather_db')
            session.execute(
                """
                CREATE TYPE IF NOT EXISTS location (
                    country TEXT,
                    city TEXT,
                    longitude FLOAT,
                    latitude FLOAT
                )
                """
            )
            session.execute(
                """
                CREATE TABLE IF NOT EXISTS measurements (
                    id UUID PRIMARY KEY,
                    date TIMESTAMP,
                    temperature FLOAT,
                    dew_point FLOAT,
                    humidity FLOAT,
                    wind TEXT,
                    wind_speed FLOAT,
                    wind_gust FLOAT,
                    pressure FLOAT,
                    precip FLOAT,
                    condition TEXT,
                    location frozen<LOCATION>
                )
                """
            )
            self._cassandra_db = session

    def __to_mongo(self, data: Record, date: datetime, id: int):
        return {
            # id is generated
            'date': date,
            'temperature': float(data['temperature']),
            'dew_point': float(data['dew_point']),
            'humidity': float(data['humidity']),
            'wind': data['wind'],
            'wind_speed': float(data['wind_speed']),
            'wind_gust': float(data['wind_gust']),
            'pressure': float(data['pressure']),
            'precip': float(data['precip']),
            'condition': data['condition'],
            'location': cities[id]
        }

    def __to_postgres(self, data: Record, date: datetime, id: int):
        return (
            date,
            float(data['temperature']),
            float(data['dew_point']),
            float(data['humidity']),
            data['wind'],
            float(data['wind_speed']),
            float(data['wind_gust']),
            float(data['pressure']),
            float(data['precip']),
            data['condition'],
            id,
        )

    def __to_cassandra(self, data: Record, date: datetime, id: int):
        return (
            date,
            float(data['temperature']),
            float(data['dew_point']),
            float(data['humidity']),
            data['wind'],
            float(data['wind_speed']),
            float(data['wind_gust']),
            float(data['pressure']),
            float(data['precip']),
            data['condition'],
            cities[id]['country'],
            cities[id]['city'],
            float(cities[id]['longitude']),
            float(cities[id]['latitude']),
        )

    def inset_data(self, data: Record):
        city = self._city
        date = datetime.strptime(' '.join([data['date'], data['time']]), '%Y-%m-%d %H:%M %p')

        if DMBS.Mongo.value in self._dbms:
            self._mongo_db.weather_db.measurements.insert_one(
                self.__to_mongo(data, date, city)
            )

        if DMBS.Postgres.value in self._dbms:
            cur = self._postgres_db.cursor()
            cur.execute(
                """
                INSERT INTO measurements (date, temperature, dew_point, humidity, wind, wind_speed, wind_gust, pressure, precip, condition, location)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                self.__to_postgres(data, date, city)
            )

        if DMBS.Cassandra.value in self._dbms:
            self._cassandra_db.execute(
                """
                INSERT INTO measurements (id, date, temperature, dew_point, humidity, wind, wind_speed, wind_gust, pressure, precip, condition, location)
                VALUES (uuid(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, { country: %s, city: %s, longitude: %s, latitude: %s })
                """,
                self.__to_cassandra(data, date, city)
            )

    def inset_batch(self, batch: List[Record]):
        city = self._city
        dates = [datetime.strptime(' '.join([data['date'], data['time']]), '%Y-%m-%d %I:%M %p') for data in batch]

        if DMBS.Mongo.value in self._dbms:
            self._mongo_db.weather_db.measurements.insert_many([
                self.__to_mongo(data, dates[i], city) for i, data in enumerate(batch)
            ])

        if DMBS.Postgres.value in self._dbms:
            cur = self._postgres_db.cursor()
            cur.execute(
                f"""
                INSERT INTO measurements (date, temperature, dew_point, humidity, wind, wind_speed, wind_gust, pressure, precip, condition, location)
                VALUES {("(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)," * len(batch))[:-1]}
                """,
                reduce(lambda t1, t2: t1 + t2, [self.__to_postgres(data, dates[i], city) for i, data in enumerate(batch)])
            )

        if DMBS.Cassandra.value in self._dbms:
            self._cassandra_db.execute(
                f"""
                BEGIN BATCH
                {"INSERT INTO measurements (id, date, temperature, dew_point, humidity, wind, wind_speed, wind_gust, pressure, precip, condition, location) VALUES (uuid(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, { country: %s, city: %s, longitude: %s, latitude: %s });" * len(batch)}
                APPLY BATCH;
                """,
                reduce(lambda t1, t2: t1 + t2, [self.__to_cassandra(data, dates[i], city) for i, data in enumerate(batch)])
            )
