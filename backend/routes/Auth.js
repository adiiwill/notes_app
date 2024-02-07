const { useDatabase } = require("../tools/useDatabase");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  // {
  //   username:   STRING
  //   password:   STRING
  // }

  const { username, password } = req.body;
  try {
    const userByUsername = await useDatabase(
      `SELECT * FROM user WHERE Username = ?`,
      [username]
    );

    if (userByUsername.length === 0) {
      res
        .status(401)
        .json({
          errorCode: "INVALID_CREDENTIALS",
          message: "Invalid credentials",
        });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      userByUsername[0].Password
    );

    if (!passwordMatch) {
      res
        .status(401)
        .json({
          errorCode: "INVALID_CREDENTIALS",
          message: "Invalid credentials",
        });
      return;
    }

    const { Password, ...otherData } = userByUsername[0];

    res.send(otherData);
  } catch (error) {
    res.status(500).json({ errorCode: "DATABASE_ERROR", message: error.code });
  }
});

module.exports = router;
