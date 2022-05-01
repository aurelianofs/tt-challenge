require('dotenv').config();
const bcrypt = require('bcryptjs');
const { DB_USER, DB_PASS, DB_HOST, DB_NAME, DEFAULT_ADMIN_USER, DEFAULT_ADMIN_PASS } = process.env;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS,
  {
    host: DB_HOST,
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
      max: 1,
      min: 0,
      acquire: 5000,
      idle: 5000
    }
  }
);

const Bike = require("./models/Bike.js")(sequelize, Sequelize);
const Location = require("./models/Location.js")(sequelize, Sequelize);
const Rating = require("./models/Rating.js")(sequelize, Sequelize);
const Reservation = require("./models/Reservation.js")(sequelize, Sequelize);
const Role = require("./models/Role.js")(sequelize, Sequelize);
const User = require("./models/User.js")(sequelize, Sequelize);

Bike.belongsTo(Location);
Bike.hasMany(Rating);
Bike.hasMany(Reservation);

Location.hasMany(Bike);

// Rating associations are defined in the model

Reservation.belongsTo(Bike);
Reservation.belongsTo(User);

Role.hasMany(User);

User.belongsTo(Role);
User.hasMany(Rating);
User.hasMany(Reservation);

const init = async () => {
  await Promise.all(["manager", "user"].map(role => {
    return Role.create({
      name: role
    });
  }));

  const userRole = await Role.findOne({
    where: {
      name: 'manager',
    }
  })

  User.create({
    username: DEFAULT_ADMIN_USER,
    password: bcrypt.hashSync(DEFAULT_ADMIN_PASS, 8),
    roleId: userRole.id
  })

  await Promise.all(['Barcelona', 'Buenos Aires', 'Bello Horizonte', 'Betelgeuse'].map(location => {
    return Location.create({name: location});
  }));

  await Promise.all([
    {model: 'modelA', color: 'red', rating: '5', locationId: 1},
    {model: 'modelB', color: 'black', rating: '5', locationId: 2},
    {model: 'modelC', color: 'red', rating: '5', locationId: 3},
    {model: 'modelD', color: 'silver', rating: '5', locationId: 1},
  ].map(bike => {
    return Bike.create(bike);
  }));

};

const db = {
  init
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.models = {
  Bike,
  Location,
  Rating,
  Reservation,
  Role,
  User,
};

module.exports = db;
