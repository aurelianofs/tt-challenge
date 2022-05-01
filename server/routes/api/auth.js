const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = process.env;
const db = require("../../db");
const { User, Role } = db.models;

module.exports = (router) => {

  // Sign Up
  router.post("/auth/signup", async (req, res) => {
    try {

      const userFound = await User.findOne({
        where: {
          username: req.body.username
        }
      });

      if( userFound ) return res.status(400).send({ message: "Failed! Username is already in use!" });

      const newUser = await User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8)
      })

      const userRole = await Role.findOne({
        where: {
          name: 'user',
        }
      })

      await newUser.setRole(userRole);

      return res.status(200).send({ message: "User was registered successfully!" });

    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }

  });

  // Log In
  router.post("/auth/login", async (req, res) => {
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) return res.status(404).send({ message: "User Not found." });

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) return res.status(401).send({ message: "Invalid Password!", accessToken: null });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    const userRole = await user.getRole();

    res.status(200).send({
      id: user.id,
      username: user.username,
      role: userRole.name,
      accessToken: token
    });

  });
};
