import mongoose from "mongoose";
import {Op} from "sequelize";
import {Measurements as MongoMeasurement} from "../model/mongo.js";
import {Measurements as PsqlMeasurements, City as PsqlCity, sequelize} from "../model/psql.js";
import {performance} from "perf_hooks";
import {client} from "../model/cassandra.js";

const queryMongo = async (from, to, city) => {
    let data = [];
    let time = -1;

    try {
        const mongo = await mongoose.connect('mongodb://mongo:mongo@localhost:27017/weather_db?authSource=admin&w=1');
        const startTime = performance.now();
        const measurements = await MongoMeasurement.find({
            date: { $gt: new Date(from), $lt: new Date(to) },
            'location.city': { $eq: city }
        });
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

    try {
        await sequelize.authenticate();
        const startTime = performance.now();
        const measurements = await PsqlMeasurements.findAll({
            where: {
                date: {
                    [Op.gt]: new Date(from),
                    [Op.lte]: new Date(to)
                },
            },
            raw: true,
            include: [{
                model: PsqlCity,
                where: {
                    city: {
                        [Op.eq]: city
                    }
                }
            }],
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

    try {
        await client.connect();
        const startTime = performance.now();
        const measurements = await client.execute(`SELECT * FROM measurements WHERE date >= ${from} AND date <= ${to}`);
        const endTime = performance.now();
        data = measurements;
        time = (endTime - startTime) / 1000;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await client.shutdown();
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
