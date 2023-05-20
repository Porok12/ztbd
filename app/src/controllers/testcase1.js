import { DataTypes, Sequelize, Op } from 'sequelize';
import mongoose from 'mongoose';
import { Measurements as MongoMeasurements } from '../model/mongo.js'
import { Measurements as PsqlMeasurements, City as PsqlCity, sequelize } from '../model/psql.js'
import { client } from '../model/cassandra.js'
import { performance } from 'perf_hooks';


const countTimePostgres = async () => {
    try {
        await sequelize.authenticate();
        const startTime = performance.now()
        await PsqlMeasurements.findAll({
            limit: 1000000,
            where: {
                dew_point: { [Op.gte]: 15 }
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
        const startTime = performance.now()
        await MongoMeasurements.find({ dew_point: { $gte: 15 } }).limit(1000000);
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    } finally {
        // await mongoose.disconnect();
    }
}

const countTimeCassandra = async () => {
    try {
        await client.connect();
        const startTime = performance.now()
        await client.execute('SELECT * FROM measurements WHERE dew_point >= 15 LIMIT 1000000 ALLOW FILTERING');
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    }
}

export const testcase1 = async (req, res) => {
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
