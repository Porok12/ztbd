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
                date: {
                    [Op.gt]: new Date("1960-10-10T00:00:00.000Z"),
                },
                condition: "Cloudy"
            },
            raw: true,
            limit: 1000000,
            include: [{
                model: PsqlCity,
                attributes: []
            }],
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
        const measurements = await MongoMeasurements.find(
                {
                    condition: "Cloudy",
                    date: { $gt: new Date("1960-10-10T00:00:00.000Z") }
                }
        ).limit(1000000);
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
        const measurements = await client.execute(`SELECT * FROM measurements Where condition='Cloudy' and date > '1960-10-10' LIMIT 1000000 ALLOW FILTERING;`);
        // console.log(measurements.rows);
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
