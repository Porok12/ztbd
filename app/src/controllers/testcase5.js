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
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('temperature')), 'temp'],
            ],
            where: {
                temperature: { [Op.lte]: 32 }
            },
            raw: true,
            include: [{
                model: PsqlCity,
                attributes: ['city']
            }],
            group: '"city"'
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
        const measurements = await MongoMeasurements.findOne({});
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
        await client.connect();
        const startTime = performance.now()
        const measurements = await client.execute('SELECT * FROM measurements LIMIT 1');
        console.log(measurements.rows);
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    }
}

export const testcase5 = async (req, res) => {
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
