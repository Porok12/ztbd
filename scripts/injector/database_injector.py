import uuid
from enum import Enum
from typing import List, TypedDict
import pymongo
import psycopg
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider


class Record(TypedDict):
    date: str
    time: str
    temperature: float
    dev_point: float
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


class DatabaseInjector:
    def __init__(self, args):
        self._dbms: List[DMBS] = args.dbms
        database_name = 'weather_db'
        measurements_table = 'measurement'
        drop = True

        if DMBS.Mongo.value in self._dbms:
            client = pymongo.MongoClient('localhost', 27017, username='mongo', password='mongo')
            # Mongo created collection automatically
            if drop:
                client.drop_database('weather_db')
            self._mongo_db = client.weather_db

        if DMBS.Postgres.value in self._dbms:
            conn = psycopg.connect(
                "host='127.0.0.1' port=5432 user='postgres' password='postgres' dbname='postgres'",
                autocommit=True,
            )
            if drop:
                conn.execute("DROP DATABASE weather_db")
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
                    longitude NUMERIC(3, 5) NOT NULL,
                    latitude NUMERIC(3, 5) NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS measures (
                    id SERIAL PRIMARY KEY,
                    date TIMESTAMP NOT NULL,
                    temperature NUMERIC(3, 3) NOT NULL,
                    dev_point NUMERIC(3, 3) NOT NULL,
                    humidity NUMERIC(3, 3) NOT NULL,
                    wind VARCHAR(2) NOT NULL,
                    wind_speed NUMERIC(3, 3) NOT NULL,
                    wind_gust NUMERIC(3, 3) NOT NULL,
                    pressure NUMERIC(3, 3) NOT NULL,
                    precip NUMERIC(3, 3) NOT NULL,
                    condition VARCHAR(32) NOT NULL,
                    location INTEGER REFERENCES cities (id)
                )
                """
            )
            self._postgres_db = conn

        if DMBS.Cassandra.value in self._dbms:
            auth_provider = PlainTextAuthProvider(username='cassandra', password='cassandra')
            cluster = Cluster(['127.0.0.1'], port=9042, auth_provider=auth_provider)
            session = cluster.connect()
            if drop:
                session.execute("DROP KEYSPACE IF EXISTS weather_db")
            session.execute(
                "CREATE KEYSPACE weather_db WITH replication = {'class':'SimpleStrategy', 'replication_factor' : 1};"
            )
            session.shutdown()
            session = cluster.connect('weather_db')
            session.execute(
                """
                CREATE TABLE IF NOT EXISTS cities (
                    id UUID PRIMARY KEY,
                    country TEXT, 
                    city TEXT,
                    longitude FLOAT,
                    latitude FLOAT
                )
                """
            )
            session.execute(
                """
                CREATE TABLE IF NOT EXISTS measures (
                    id UUID PRIMARY KEY,
                    date TIMESTAMP,
                    temperature FLOAT,
                    dev_point FLOAT,
                    humidity FLOAT,
                    wind TEXT,
                    wind_speed FLOAT,
                    wind_gust FLOAT,
                    pressure FLOAT,
                    precip FLOAT,
                    condition TEXT
                )
                """
            )
            self._cassandra_db = session

    def inset_data(self, data: Record):

        if DMBS.Mongo.value in self._dbms:
            self._mongo_db.measurements.insert_one({
                # id is generated
                'date': data['date'],
                'temperature': data['temperature'],
                'dev_point': data['dev_point'],
                'humidity': data['humidity'],
                'wind': data['wind'],
                'wind_speed': data['wind_speed'],
                'wind_gust': data['wind_gust'],
                'pressure': data['pressure'],
                'precip': data['precip'],
                'condition': data['condition'],
                'location': {
                    'country': 'poland',
                    'city': 'warsaw',
                    'longitude': '21.017532',
                    'latitude': '52.237049',
                }
            })

        elif DMBS.Postgres.value in self._dbms:
            cur = self._postgres_db.cursor()
            cur.execute(  # TODO
                """
                INSERT INTO measurements (date, temperature, dev_point, humidity, wind, wind_speed, wind_gust, pressure, precip, condition) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (1, 'test')
            )

        elif DMBS.Cassandra.value in self._dbms:
            self._cassandra_db.execute(  # TODO
                """
                INSERT INTO measurements (date, temperature, dev_point, humidity, wind, wind_speed, wind_gust, pressure, precip, conditio)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (uuid.uuid1(), 'test')
            )

