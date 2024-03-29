import cassandra from 'cassandra-driver';

export const client = new cassandra.Client({
    keyspace: 'weather_db',
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    credentials: {
        username: 'cassandra',
        password: 'cassandra',
    }
});

// client.execute('CREATE INDEX IF NOT EXISTS index_date ON weather_db.measurements (xxx)');
