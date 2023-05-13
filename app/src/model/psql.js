import {DataTypes, Sequelize, Op} from 'sequelize';

export const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/weather_db');

export const City = sequelize.define('cities', {
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
}, {
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['city'],
        }
    ]
});

export const Measurements = sequelize.define('measurements', {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    temperature: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    dew_point: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    humidity: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    wind: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wind_speed: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    wind_gust: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    pressure: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    precip: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    condition: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: City,
        referencesKey: 'id',
    },
}, {
    timestamps: false,
    indexes: [
        {
            unique: false,
            fields: ['date'],
        }
    ]
});

Measurements.hasOne(City, { foreignKey: 'id', sourceKey: 'location' });
// City.belongsTo(Measurements, { targetKey: 'id', foreignKey: 'location' });

