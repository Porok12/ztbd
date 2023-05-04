import {DataTypes, Sequelize, Op} from 'sequelize';

export const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/weather_db');

const City = sequelize.define('cities', {
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
});

const Measurements = sequelize.define('measurements', {
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
});


// Measurements.hasOne(City, { foreignKey: 'id', sourceKey: 'location' });
export const measurePostgres = Measurements;
export const cityPostgres = City;

// City.belongsTo(Measurements, { targetKey: 'id', foreignKey: 'location' });

// module.exports = sequelize.model('Measurements', Measurements);
// async function fff(){
// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     console.time("dbsave");
//     const measurements = await Measurements.findAll({
//         attributes: [
//             [sequelize.fn('COUNT', sequelize.col('temperature')), 'temp'],
//         ],

//         where: {
//             temperature: {[Op.lte]: 32}
//         },
//         raw: true,
//         include: [{ model: City,
//         attributes: ['city'] }],
//         group: '"city"'
//     });
//     console.timeEnd("dbsave");
//     console.log(measurements);
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// } finally {
//     await sequelize.close();
// }
// }