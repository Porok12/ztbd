import { DataTypes, Sequelize, Op } from 'sequelize';
import mongoose from 'mongoose';
import { Measurements as MongoMeasurements } from '../model/mongo.js'
import { Measurements as PsqlMeasurements, City as PsqlCity, sequelize } from '../model/psql.js'
import { client } from '../model/cassandra.js'
import { performance } from 'perf_hooks';


const countTimePostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const startTime = performance.now()
        const measurements = await PsqlMeasurements.findAll({
            where: {
                temperature: { [Op.gte]: 32 },
                humidity: { [Op.gt]: 75 }
            },
            raw: true,
        });
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    }
}


const countTimeMongo = async () => {
    try {
        await mongoose.connect('mongodb://mongo:mongo@localhost:27017/weather_db?authSource=admin&w=1');
        console.log('Connection has been established successfully.');
        const startTime = performance.now()
        const measurements = await MongoMeasurements.find({
                temperature: { $gte: 32 },
                humidity: { $gt: 75 }
        });
        console.log(measurements);
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    } finally {
        await mongoose.disconnect();
    }
}


const countTimeCassandra = async () => {
    try {
        const location = `{country: 'poland', city: 'warsaw', longitude: 21.017532, latitude: 52.237049}`;
        await client.connect();
        const startTime = performance.now()
        const measurements = await client.execute(`SELECT * FROM measurements WHERE temperature >= 32 AND humidity > 75 ALLOW FILTERING;`);
        // console.log(measurements.rows);
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    }
}

export const testcase6 = async (req, res) => {
    const mongo = await countTimeMongo();
    const postgres = await countTimePostgres();
    const cassandra = await countTimeCassandra();
    const data = {
        mongo,
        postgres,
        cassandra,
    };
    res.status(200).json(data);
}
