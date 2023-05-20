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
            raw: true,
            limit: 1000000,
            include: [{
                model: PsqlCity,
                where: {
                    city: {
                        [Op.eq]: 'cracow'
                    }
                }
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
        const startTime = performance.now()
        await MongoMeasurements.find({
            'location.city': 'cracow'
        }).limit(1000000);
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
    const location = `{country: 'poland', city: 'warsaw', longitude: 21.017532, latitude: 52.237049}`;
    try {
        await client.connect();
        const startTime = performance.now()
        await client.execute(`SELECT * FROM measurements WHERE location=${location} LIMIT 1000000`);
        const endTime = performance.now();
        return (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return -1;
    }
}

export const testcase2 = async (req, res) => {
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
