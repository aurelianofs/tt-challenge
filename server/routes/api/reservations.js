const express = require('express');
const db = require("../../db");
const { User, Bike, Rating, Reservation } = db.models;
const { verifyToken, addUser, isManager } = require('../../middlewares/auth');
const getOrderBy = require('../../aux/get-order-by')



module.exports = (baseRouter) => {
  const router = express.Router();

  baseRouter.use('/reservations', [verifyToken], router);

  router.get('/', [addUser], async (req, res) => {

    try {
      let order = getOrderBy(req.query.sort) || ['dateFrom', 'ASC']
      let limit = Number(req.query.limit) || 50
      let page = Number(req.query.page) || 1
      let offset = (page - 1) * limit

      const where = {}

      if(req.user.role.name === 'manager') {
        let userId = req.query.userId
        if(userId) where.userId = userId
      } else {
        where.userId = req.userId
      }

      let bikeId = req.query.bikeId
      if(bikeId) where.bikeId = bikeId

      const include = [Bike];

      const reservations = await Reservation.findAndCountAll({
        where, order: [order], limit, offset, include
      });
      return res.status(200).send(reservations)
    } catch (error) {
      return res.status(500).send(error.message);
    }

  });

  router.delete('/:id', [addUser], async (req, res) => {
    try {
      const model = await Reservation.findByPk(req.params.id);

      if(model.userId !== req.userId && req.user.role.name !== 'manager') return res.status(403).send({ message: "Requires Manager Role!" });

      if(!model) return res.status(404).send({ message: 'Not found' });

      await model.destroy()
      return res.status(200).send(model)
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });
}
