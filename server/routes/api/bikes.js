const express = require('express');
const db = require("../../db");
const { User, Bike, Rating, Reservation, Location } = db.models;
const {sequelize, Sequelize} = db
const Op = Sequelize.Op
const { verifyToken, isManager, addUser } = require('../../middlewares/auth');
const getOrderBy = require('../../aux/get-order-by')


module.exports = (baseRouter) => {
  const router = express.Router();

  baseRouter.use('/bikes', [verifyToken], router);

  router.get('/', async (req, res) => {
    try {
      const order = getOrderBy(req.query.sort) || ['model', 'ASC'];
      const limit = Number(req.query.limit) || 50;
      const page = Number(req.query.page) || 1;
      const offset = (page - 1) * limit;

      const query = {
        order: [order], limit, offset, include: []
      };
      const where = {};

      const color = req.query.color;
      if(color) where.color = color;

      const bikeModel = req.query.model;
      if(bikeModel) where.model = bikeModel;

      const rating = req.query.rating;
      if(rating) where.rating = {[Op.gte]: rating};

      const location = req.query.location;
      if(location) where.locationId = location;

      query.include.push(Location);

      // Adds current user rating
      const withUserRating = req.query.withUserRating;
      if(withUserRating) {
        const userId = req.userId;
        query.include.push({
          model: Rating,
          where: {userId},
          required: false,
        });
      }

      const dateFrom = req.query.dateFrom;
      const dateTo = req.query.dateTo;

      if(dateFrom && dateTo) {
        const sql = `
          SELECT DISTINCT bikeId FROM RESERVATIONS
          WHERE
            (dateFROM BETWEEN '${dateFrom}' AND '${dateTo}')
            OR (dateTo BETWEEN '${dateFrom}' AND '${dateTo}')
        `;

        const [results, metadata] = await sequelize.query(sql);
        const rentedBikes = results.map(b => b.bikeId);
        where.id = {[Op.notIn]: rentedBikes};
      }

      if(Object.keys(where).length) query.where = where;

      const bikes = await Bike.findAndCountAll(query);
      return res.status(200).send(bikes);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.get('/colors', async (req, res) => {
    try {
      const colors = await Bike.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('color')) ,'color'],
        ]
      });

      return res.send(colors.map(e => e.color));

    } catch (error) {
      return res.status(500).send(error.message);
    }
  })

  router.get('/models', async (req, res) => {
    try {
      const models = await Bike.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('model')) ,'model'],
        ]
      });

      return res.send(models.map(e => e.model))

    } catch (error) {
      return res.status(500).send(error.message);
    }
  })


  router.get('/:id', [addUser], async (req, res) => {
    try {

      const query = {
        include: [
          Location,
          {
            model: Reservation,
            attributes: {exclude: ['userId']},
            include: req.user.role.name === 'manager' ? [
              {
                model: User,
              }
            ] : [],
          }
        ],
      };

      const model = await Bike.findByPk(req.params.id, query);

      if(!model) return res.status(404).send({ message: 'Not found' });

      return res.send(model)
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.post('/create', [addUser, isManager], async (req, res) => {
    try {
      const model = await Bike.create({
        model: req.body.model,
        locationId: req.body.locationId,
        color: req.body.color,
        available: req.body.available,
        rating: 5
      });
      return res.send(model);

    } catch (error) {
      return res.status(500).send(error.message);
    }

  });

  router.post('/:id', [addUser, isManager], async (req, res) => {
    try {
      const model = await Bike.findByPk(req.params.id)

      if(!model) return res.status(404).send({ message: 'Not found' });

      model.model = req.body.model
      model.locationId = req.body.locationId,
      model.color = req.body.color,
      model.available = req.body.available,

      await model.save();
      return res.send(model);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.delete('/:id', [addUser, isManager], async (req, res) => {
    try {
      const model = await Bike.findByPk(req.params.id);

      if(!model) return res.status(404).send({ message: 'Not found' });

      model.destroy();
      return res.send(model);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.post('/:id/rate/:rate', async (req, res) => {
    try {
      const bike = await Bike.findByPk(req.params.id);
      if(!bike) return res.status(404).send({ message: 'Not found' });

      const userId = req.userId;

      let rating = await Rating.findOne({
        where: {bikeId: bike.id, userId}
      });

      rating || (rating = new Rating({bikeId: bike.id, userId}));

      console.log(userId);
      console.log(rating);

      rating.rate = req.params.rate;
      await rating.save();

      const avg = await Rating.findOne({
        where: {bikeId: bike.id},
        attributes: [
          [Sequelize.fn('AVG', Sequelize.col('rate')), 'rateAVG'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'rateCOUNT'],
        ],
        raw: true
      });

      bike.rating = parseFloat(avg.rateAVG);
      await bike.save();

      return res.send({bike, rating: avg, userRate: req.params.rate});

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.get('/:id/reservations/:dateFrom?', async (req, res) => {
    try {
      const bike = await Bike.findByPk(req.params.id);
      if(!bike) return res.status(404).send({ message: 'Not found' });

      const where = { bikeId: bike.id };
      if (req.params.dateFrom) where.dateFrom = dateFrom;

      const reservations = await Reservation.findAll({
        where
      });
      return res.send(reservations);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.post('/:id/reserve/:dateFrom/:dateTo', async (req, res) => {
    try {
      const bike = await Bike.findByPk(req.params.id)
      if(!bike) return res.status(404).send({ message: 'Not found' });

      const userId = req.userId;

      const reservation = await Reservation.create({
        dateFrom: req.params.dateFrom,
        dateTo: req.params.dateTo,
        bikeId: bike.id,
        userId
      })
      return res.send(reservation)

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

}
