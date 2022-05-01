module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const Bike = sequelize.define("bikes", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    locationId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  return Bike;
};

