const express = require('express');
const bcrypt = require('bcryptjs');
const db = require("../../db");
const { User, Role, Reservation, Bike } = db.models;
const { verifyToken, addUser, isManager } = require('../../middlewares/auth');
const getOrderBy = require('../../aux/get-order-by');

module.exports = (baseRouter) => {
  const router = express.Router();

  baseRouter.use('/users', [ verifyToken, addUser, isManager ], router);

  router.get('/', async (req, res) => {
    try {
      let order = getOrderBy(req.query.sort) || ['id', 'ASC']
      let limit = Number(req.query.limit) || 50
      let page = Number(req.query.page) || 1
      let offset = (page - 1) * limit

      const query = {
        order: [order], limit, offset, include: []
      }

      query.include = Role;
      query.attributes = {exclude: ['password']};

      const users = await User.findAndCountAll(query);
      return res.status(200).send(users)

    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  });

  router.post('/create', async (req, res) => {
    try {
      const userFound = await User.findOne({
        where: {
          username: req.body.username
        }
      });

      if( userFound ) return res.status(400).send({ message: "Failed! Username is already in use!" });

      await User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        roleId: req.body.roleId,
      });

      return res.status(200).send({ message: "User was created successfully!" });

    } catch (error) {
      return res.status(500).send(error.message);
    }

  });

  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          Role,
          {model: Reservation, include: [Bike] }
        ],
        attributes: {exclude: ['password']}
      });

      if(!user) return res.status(404).send({ message: 'User not found' });

      return res.status(200).send(user);

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.post('/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if(!user) return res.status(404).send({ message: 'User not found' });

      user.username = req.body.username;
      if(req.body.password) user.password = bcrypt.hashSync(req.body.password, 8);

      await user.save();

      const role = await Role.findByPk(req.body.roleId);
      await user.setRole(role);

      const { id, username } = user;

      return res.status(200).send({
        id,
        username,
        role: {
          id: role.id,
          name: role.name,
        }
      });

    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if(!user) return res.status(404).send({ message: 'User not found' });

      user.destroy();

      return res.status(200).send({
        message: 'User deleted'
      });

    } catch (error) {
      return res.status(500).send(error.message);
    }
  })

}
