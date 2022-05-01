module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const Role = sequelize.define("roles", {
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

  return Role;
};

