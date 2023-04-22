import cassandra from 'cassandra-driver';

const client = new cassandra.Client({
    keyspace: 'weather_db',
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1',
    credentials: {
        username: 'cassandra',
        password: 'cassandra',
    }
});

try {
    await client.connect();
    const measurements = await client.execute('SELECT * FROM measurements LIMIT 1');
    console.log(measurements.rows);
} catch (error) {
    console.error('Unable to connect to the database:', error);
} finally {
    await client.shutdown();
}
