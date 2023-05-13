import mongoose from "mongoose";
import {Measurements} from "../model/mongo.js";
import {performance} from "perf_hooks";
import {client} from "../model/cassandra.js";

export const queryData = async (req, res) => {
    let data = [];
    let time = 0;

    const { from, to, city } = req.query;
    console.log(from, to, city);

    try {
        const mongo = await mongoose.connect('mongodb://mongo:mongo@localhost:27017/weather_db?authSource=admin&w=1');
        console.log('Connection has been established successfully.');

        const startTime = performance.now();
        const measurements = await Measurements.find({
            date: { $gt: new Date(from), $lt: new Date(to) },
            'location.city': { $eq: city }
        });
        const endTime = performance.now();
        data = measurements;
        time = endTime - startTime;
        await mongo.disconnect();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        //await mongoose.disconnect();
    }

    res.status(200).json({ time, data });
};
