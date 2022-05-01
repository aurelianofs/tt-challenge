const express = require('express');
const db = require("../../db");
const { User, Location } = db.models;
const { verifyToken, addUser, isManager } = require('../../middlewares/auth');
const getOrderBy = require('../../aux/get-order-by')


module.exports = (baseRouter) => {
  const router = express.Router();

  baseRouter.use('/locations', [ verifyToken ], router);

  router.get('/', async (req, res) => {
    try {
      const order = getOrderBy(req.query.sort) || ['name', 'ASC'];
      const limit = req.query.limit || 50;
      const page = req.query.page || 1;
      const offset = (page - 1) * limit;

      const locations = await Location.findAndCountAll({
        order: [order], limit, offset
      });

      return res.status(200).send(locations);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const model = await Location.findByPk(req.params.id);

      if(!model) return res.status(404).send({ message: 'Not found' });

      return res.send(model);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.post('/create', [addUser, isManager], async (req, res) => {
    try {
      const model = await Location.create({
        name: req.body.name,
      });
      return res.send(model);

    } catch (error) {
      return res.status(500).send(error.message);
    }

  });

  router.post('/:id', [addUser, isManager], async (req, res) => {
    try {
      const model = await Location.findByPk(req.params.id);

      if(!model) return res.status(404).send({ message: 'Not found' });

      model.name = req.body.name
      await model.save()
      return res.send(model);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

}
