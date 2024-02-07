const { useDatabase } = require("../tools/useDatabase");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

router.get("/get/:UserID", async (req, res) => {
  const userId = req.params.UserID;
  try {
    const result = await useDatabase(
      `SELECT Username, Email FROM user WHERE UserID = ?`,
      [userId]
    );
    res.send(result);
  } catch (error) {
    res.status(500).json({ errorCode: "DATABASE_ERROR", message: error.code });
  }
});

router.post("/add", async (req, res) => {
  // {
  //   username:   STRING
  //   email:      STRING
  //   password:   STRING
  // }
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({
        errorCode: "MISSING_CREDENTIALS",
        message: "Missing credentials",
      });

  try {
    const existingUserByUsername = await useDatabase(
      "SELECT * FROM user WHERE Username = ?",
      [username]
    );
    if (existingUserByUsername.length !== 0) {
      return res
        .status(409)
        .json({ errorCode: "USERNAME_TAKEN", message: "Username is taken" });
    }

    const existingUserByEmail = await useDatabase(
      "SELECT * FROM user WHERE Email = ?",
      [email]
    );
    if (existingUserByEmail.length !== 0) {
      return res
        .status(409)
        .json({
          errorCode: "EMAIL_IN_USE",
          message: "Email is already in use",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await useDatabase(
      "INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
  }
});

module.exports = router;
