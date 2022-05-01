const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const db = require("../db");
const { User, Role } = db.models;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }

    req.userId = decoded.id;
    next();
  });
};

addUser = (req, res, next) => {
  User
  .findByPk(req.userId, { include: Role })
  .then(user => {
    req.user = user;

    next();
    return;
  });
};

isManager = (req, res, next) => {
  if (req.user.role.name !== "manager") res.status(403).send({ message: "Requires Manager Role!" });

  next();
  return;
};

const authJwt = {
  verifyToken,
  isManager,
  addUser,
};

module.exports = authJwt;
