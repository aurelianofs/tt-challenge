const router = require('express').Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/", (req, res) => {
  res.json({ message: "This is the bike rentals api" });
});

require('./auth')(router);
require('./users')(router);
require('./roles')(router);
require('./locations')(router);
require('./bikes')(router);
require('./reservations')(router);

module.exports = router;
