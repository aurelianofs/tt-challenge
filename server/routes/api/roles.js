const express = require('express');
const db = require("../../db");
const { Role } = db.models;
const { verifyToken, isManager, addUser } = require('../../middlewares/auth');

module.exports = (baseRouter) => {
  const router = express.Router();

  baseRouter.use('/roles', [ verifyToken, addUser, isManager ], router);

  router.get('/', async (req, res) => {
    const roles = await Role.findAll();

    res.status(200).send(
      roles.map(({ id, name }) => ({
        id,
        name
      }))
    );
  });

}
