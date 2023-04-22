import mongoose from 'mongoose';

const measurementsSchema = new mongoose.Schema({
    date: Date,
    temperature: Number,
    dew_point: Number,
    humidity: Number,
    wind: String,
    wind_speed: Number,
    wind_gust: Number,
    pressure: Number,
    precip: Number,
    condition: String,
    location: {
        country: String,
        city: String,
        longitude: Number,
        latitude: Number,
    },
}, {

});

const Measurements = mongoose.model('measurements', measurementsSchema);

try {
    await mongoose.connect('mongodb://mongo:mongo@localhost:27017/weather_db?authSource=admin&w=1');
    console.log('Connection has been established successfully.');
    const measurements = await Measurements.findOne({});
    console.log(measurements);
} catch (error) {
    console.error('Unable to connect to the database:', error);
} finally {
    await mongoose.disconnect();
}
