module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = Sequelize;

  const Rating = sequelize.define("ratings",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bikeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['bikeId', 'userId'],
        },
      ],
      classMethods: {
        associate: function (models) {
          Rating.belongsTo(models.Bike);
          Rating.belongsTo(models.User);
        },
      },
    }
  );

  return Rating;
};

