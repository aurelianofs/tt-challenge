module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const Location = sequelize.define("locations", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Location;
};

