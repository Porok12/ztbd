from enum import Enum
import pymongo
import psycopg
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import uuid


class DMBS(Enum):
    Mongo = 'mongo'
    Postgres = 'postgres'
    Cassandra = 'cassandra'


class DatabaseInjector:
    def __init__(self, dbms: DMBS, username: str, password: str):
        self._dbms = dbms

        if dbms == DMBS.Mongo.value:
            client = pymongo.MongoClient('localhost', 27017, username=username, password=password)
            self._mongo_db = client.weather_db

        elif dbms == DMBS.Postgres.value:
            print("dbname='weather_db' host='localhost' port=5432 user='%s' password='%s'" % (username, password))
            conn = psycopg.connect(
                "dbname='weather_db' host='127.0.0.1' port=5432 user='postgres' password='postgres'",
                autocommit=True,
            )
            self._postgres_db = conn

        elif dbms == DMBS.Cassandra.value:
            auth_provider = PlainTextAuthProvider(username=username, password=password)
            cluster = Cluster(['127.0.0.1'], port=9042, auth_provider=auth_provider)
            session = cluster.connect('weather_db')
            self._cassandra_db = session

    def inset_data(self, data: any):
        if self._dbms == DMBS.Mongo.value:
            self._mongo_db.warsaw.insert_one({'test': 123})

        elif self._dbms == DMBS.Postgres.value:
            cur = self._postgres_db.cursor()
            cur.execute(
                """
                INSERT INTO warsaw (id, data) 
                VALUES (%s, %s)
                """,
                (1, 'test')
            )

        elif self._dbms == DMBS.Cassandra.value:
            self._cassandra_db.execute(
                """
                INSERT INTO warsaw (id, data)
                VALUES (%s, %s)
                """,
                (uuid.uuid1(), 'test')
            )

