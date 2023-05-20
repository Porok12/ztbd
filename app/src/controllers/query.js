import mongoose from "mongoose";
import {Op} from "sequelize";
import {Measurements as MongoMeasurement} from "../model/mongo.js";
import {Measurements as PsqlMeasurements, City as PsqlCity, sequelize} from "../model/psql.js";
import {performance} from "perf_hooks";
import {client} from "../model/cassandra.js";

const cities = {
    warsaw: {
        country: 'poland',
        city: 'warsaw',
        longitude: 21.017532,
        latitude: 52.237049,
    },
    cracow: {
        country: 'poland',
        city: 'cracow',
        longitude: 19.944544,
        latitude: 50.049683,
    },
    wroclaw: {
        country: 'poland',
        city: 'wroclaw',
        longitude: 17.0319771,
        latitude: 51.1099804,
    },
    katowice: {
        country: 'poland',
        city: 'katowice',
        longitude: 19.0133333,
        latitude: 50.2597222,
    },
}

const queryMongo = async (from, to, city) => {
    let data = [];
    let time = -1;

    console.log('=== MONGODB ===');

    try {
        const mongo = await mongoose.connect('mongodb://mongo:mongo@localhost:27017/weather_db?authSource=admin&w=1');
        const startTime = performance.now();
        const measurements = await MongoMeasurement.find({
            date: { $gt: new Date(from), $lt: new Date(to) },
            'location.city': { $eq: city }
        }, {_id: 0, temperature: 1, humidity: 1, date: 1}).sort({date:1});
        const endTime = performance.now();
        await mongo.disconnect();
        data = measurements;
        time = (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    return { data, time };
}

const queryPostgres = async (from, to, city) => {
    let data = [];
    let time = -1;

    console.log('=== POSTGRES ===');

    try {
        await sequelize.authenticate();
        const startTime = performance.now();
        const measurements = await PsqlMeasurements.findAll({
            attributes: ['temperature', 'humidity', 'date'],
            where: {
                date: {
                    [Op.gt]: new Date(from),
                    [Op.lt]: new Date(to),
                },
            },
            raw: true,
            include: [{
                model: PsqlCity,
                attributes: [],
                where: {
                    city: {
                        [Op.eq]: city
                    }
                }
            }],
            order: [
                ['date', 'ASC']
            ],
        });
        const endTime = performance.now();
        // await sequelize.close();
        data = measurements;
        time = (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    return { data, time };
}

const queryCassandra = async (from, to, city) => {
    let data = [];
    let time = -1;

    console.log('=== CASSANDRA ===');

    const location = `{country: '${cities[city].country}', city: '${cities[city].city}', longitude: ${cities[city].longitude}, latitude: ${cities[city].latitude}}`;
    const query = `SELECT temperature, humidity, date FROM measurements WHERE location=${location} AND date > '${from}' AND date < '${to}' ORDER BY date ASC`;
    console.log(query);

    try {
        await client.connect();
        const startTime = performance.now();
        const measurements = await client.execute(query);
        const endTime = performance.now();
        data = measurements.rows;
        time = (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        // await client.shutdown();
    }

    return { data, time };
}

export const queryData = async (req, res) => {
    const { from, to, city, db } = req.query;

    let data;
    switch (db) {
        case 'mongo':
            data  = await queryMongo(from, to, city);
            break;
        case 'postgres':
            data  = await queryPostgres(from, to, city);
            break;
        case 'cassandra':
            data  = await queryCassandra(from, to, city);
            break;
    }

    res.status(200).json(data);
};
