import { DataTypes, Sequelize, Op } from 'sequelize';
import mongoose from 'mongoose';
import path from "path";
import { Measurements } from '../model/mongo.js'
import { measurePostgres, cityPostgres, sequelize } from '../model/psql.js'
import { client } from '../model/cassandra.js'
import { performance } from 'perf_hooks';

const __dirname = path.resolve(path.dirname(''));

export const countTime = async (req, res) => {

    measurePostgres.hasOne(cityPostgres, { foreignKey: 'id', sourceKey: 'location' });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        var startTime = performance.now()
        const measurements = await measurePostgres.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('temperature')), 'temp'],
            ],

            where: {
                temperature: { [Op.lte]: 32 }
            },
            raw: true,
            include: [{
                model: cityPostgres,
                attributes: ['city']
            }],
            group: '"city"'
        });
        var endTime = performance.now();
        var time = {
            "time": endTime - startTime,
        };
        res.json(time);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


export const countTimeMongo = async (req, res) => {
    try {
        await mongoose.connect('mongodb://mongo:mongo@localhost:27017/weather_db?authSource=admin&w=1');
        console.log('Connection has been established successfully.');
        var startTime = performance.now()
        const measurements = await Measurements.findOne({});
        console.log(measurements);
        var endTime = performance.now();
        var time = {
            "time": endTime - startTime,
        };
        res.json(time);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await mongoose.disconnect();
    }
}


export const countTimeCassandra = async (req, res) => {
    try {
        await client.connect();
        var startTime = performance.now()
        const measurements = await client.execute('SELECT * FROM measurements LIMIT 1');
        console.log(measurements.rows);
        var endTime = performance.now();
        var time = {
            "time": endTime - startTime,
        };
        res.json(time);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

