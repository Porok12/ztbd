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

measurementsSchema.index({ date: 1 });
measurementsSchema.index({ 'location.city': 1, date: 1 });

export const Measurements = mongoose.model('Measurements', measurementsSchema);

