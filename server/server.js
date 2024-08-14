import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = 5001;
const saltRounds = 12;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET);
};

app.post("/api/refresh", async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json({
      error: "You are not authenticated, you cannot access this route.",
    });
  }

  const data = await db.query("SELECT * FROM users WHERE refresh_token=$1", [
    refreshToken,
  ]);

  if (data.rows.length === 0) {
    return res
      .status(401)
      .json({ error: "You are not logged in! Log in and try again" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ message: "Token is invalid!" });
      }
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      await db.query("UPDATE users SET refresh_token = $1 WHERE email = $2", [
        newRefreshToken,
        user.email,
      ]);

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  );
});

app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res.json({ error: "User already exists" });
    } else {
      const refreshToken = generateRefreshToken({ email });
      const accessToken = generateAccessToken({ email });

      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          return res.json({ error: err });
        }

        let user = await db.query(
          "INSERT INTO users (email, password, refresh_token, coins) VALUES ($1, $2, $3, 0) RETURNING *",
          [email, hash, refreshToken]
        );

        await db.query(
          "INSERT INTO shop (user_id, bronze_medal, silver_medal, gold_medal, diamond_medal) VALUES ($1, $2, $3, $4, $5)",
          [user.rows[0].id, false, false, false, false]
        );

        user = user.rows[0];
        const userWithToken = { email: user.email, accessToken, refreshToken };
        res.json(userWithToken);
      });
    }
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User does not exist " });
    } else {
      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password);

      if (valid) {
        const accessToken = generateAccessToken({ email: user.email });
        const userWithToken = {
          email: user.email,
          accessToken,
          refreshToken: user.refresh_token,
          coins: user.coins,
        };
        res.status(200).json(userWithToken);
      } else {
        res.status(401).json({ error: "Incorrect password, try again" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token is invalid! You are not authenticated!" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

app.post("/api/updatetime", verify, async (req, res) => {
  const { email, studytime } = req.body;

  try {
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;
    const study_record = await db.query(
      "SELECT * FROM studytime WHERE user_id=$1 AND study_date=CURRENT_DATE",
      [user_id]
    );
    if (study_record.rows.length > 0) {
      await db.query(
        "UPDATE studytime SET study_time = study_time + $2 WHERE user_id = $1 AND study_date = CURRENT_DATE",
        [user_id, studytime]
      );
    } else {
      await db.query(
        "INSERT INTO studytime (user_id, study_date, study_time) VALUES ($1, CURRENT_DATE, $2)",
        [user_id, studytime]
      );
      await db.query("UPDATE users SET streak = streak + 1 WHERE id = $1", [
        user_id,
      ]);
    }

    await db.query("UPDATE users SET coins=coins+$1 WHERE id=$2", [
      Math.round(studytime / 60),
      user_id,
    ]);

    res.json({ message: "Successfully updated!" });
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

app.post("/api/getstudytime", verify, async (req, res) => {
  const { email } = req.body;
  try {
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;

    const result = await db.query(
      "SELECT SUM(study_time) AS total_study_time FROM studytime WHERE user_id = $1",
      [user_id]
    );

    const totalStudyTime = result.rows[0].total_study_time;
    res.json({ studyTime: (totalStudyTime / (60 * 60)).toFixed(2) });
  } catch (err) {
    console.error(err);
    res.json({ error: err });
  }
});

app.post("/api/getstudytimestat", async (req, res) => {
  const { email } = req.body;
  try {
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;
    let studyStat = await db.query(
      "SELECT TO_CHAR(study_date, 'YYYY-MM-DD') AS study_date, study_time FROM studytime WHERE user_id = $1",
      [user_id]
    );
    res.status(200).json({ studyStat: studyStat.rows });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

app.post("/api/gettasks", verify, async (req, res) => {
  const { email } = req.body;
  try {
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;
    let tasks = await db.query(
      "SELECT task_title, priority FROM tasks WHERE user_id=$1",
      [user_id]
    );
    tasks = tasks.rows;
    res.status(200).json({ tasks: tasks });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

//Adds tasks twice, there is an error
app.post("/api/addtasks", verify, async (req, res) => {
  try {
    const { email, taskTitle, priority } = req.body;
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;
    await db.query(
      "INSERT INTO tasks (user_id, task_title, priority) VALUES ($1, $2, $3)",
      [user_id, taskTitle, priority]
    );
    res.status(200).json({ message: "Task successfully added!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

app.post("/api/removetasks", verify, async (req, res) => {
  try {
    const { email, taskTitle } = req.body;
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;
    await db.query(
      `DELETE FROM tasks
       WHERE ctid = (
         SELECT ctid FROM tasks
         WHERE user_id=$1 AND task_title=$2
         LIMIT 1
       )`,
      [user_id, taskTitle]
    );
    res.status(200).json({ message: "Task removed!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

app.post("/api/updatestreak", verify, async (req, res) => {
  try {
    const { email } = req.body;
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;
    const result = await db.query(
      "SELECT * FROM studytime WHERE user_id = $1 AND study_date = CURRENT_DATE - INTERVAL '1 day'",
      [user_id]
    );

    const result_2 = await db.query(
      "SELECT * FROM studytime WHERE user_id = $1 AND study_date = CURRENT_DATE",
      [user_id]
    );

    if (result.rows.length >= 1) {
      res.status(200).json({ message: "Successful" });
      return;
    }

    if (result_2.rows.length === 0) {
      await db.query("UPDATE users SET streak=0 WHERE id=$1", [user_id]);
    }

    res.status(200).json({ message: "Successful" });
    return;
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
    return;
  }
});

app.post("/api/getstreak", verify, async (req, res) => {
  const { email } = req.body;
  try {
    let streak = await db.query("SELECT streak FROM users WHERE email=$1", [
      email,
    ]);
    res.status(200).json(streak.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

app.post("/api/addhabit", verify, async (req, res) => {
  const { email, habitTitle } = req.body;
  try {
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;

    await db.query(
      "INSERT INTO habits (user_id, last_done, streak, habit_name) VALUES ($1, $2, $3, $4)",
      [user_id, "2000-09-09", 0, habitTitle]
    );

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

app.post("/api/gethabit", verify, async (req, res) => {
  const { email } = req.body;
  try {
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;

    let habits = await db.query(
      "SELECT last_done, streak, habit_name FROM habits WHERE user_id=$1",
      [user_id]
    );

    habits = habits.rows;

    await Promise.all(
      habits.map(async (habit) => {
        const currentDate = new Date().toLocaleDateString("en-CA");
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toLocaleDateString("en-CA");
        const habitLastDoneString = new Date(habit.last_done)
          .toISOString()
          .split("T")[0];
        if (habitLastDoneString === yesterdayString) {
          return;
        } else {
          if (habitLastDoneString !== currentDate) {
            await db.query(
              "UPDATE habits SET streak=0 WHERE habit_name=$1 AND user_id=$2",
              [habit.habit_name, user_id]
            );
            habit.streak = 0;
          }
        }
      })
    );

    res.status(200).json({ habits: habits });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

app.post("/api/updatestreakhabit", verify, async (req, res) => {
  try {
    const { email, habitName } = req.body;
    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;

    await db.query(
      "UPDATE habits SET streak = streak + 1, last_done = CURRENT_DATE WHERE habit_name = $1 AND user_id = $2",
      [habitName, user_id]
    );

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/getcoins", async (req, res) => {
  try {
    const { email } = req.body;
    let coins = await db.query("SELECT coins FROM users WHERE email=$1", [
      email,
    ]);
    res.status(200).json({ coins: coins.rows[0].coins });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/updateshop", async (req, res) => {
  try {
    const { email, shopItem } = req.body;

    let user_id = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    user_id = user_id.rows[0].id;

    if (shopItem === "Bronze Badge") {
      await db.query("UPDATE shop SET bronze_medal=true WHERE user_id=$1", [
        user_id,
      ]);
      await db.query("UPDATE users SET coins = coins - 20 WHERE id=$1", [
        user_id,
      ]);
    } else if (shopItem === "Silver Badge") {
      await db.query("UPDATE shop SET silver_medal=true WHERE user_id=$1", [
        user_id,
      ]);
      await db.query("UPDATE users SET coins = coins - 75 WHERE id=$1", [
        user_id,
      ]);
    } else if (shopItem === "Gold Badge") {
      await db.query("UPDATE shop SET gold_medal=true WHERE user_id=$1", [
        user_id,
      ]);
      await db.query("UPDATE users SET coins = coins - 200 WHERE id=$1", [
        user_id,
      ]);
    } else if (shopItem === "Diamond Badge") {
      await db.query("UPDATE shop SET diamond_medal=true WHERE user_id=$1", [
        user_id,
      ]);
      await db.query("UPDATE users SET coins = coins - 1000 WHERE id=$1", [
        user_id,
      ]);
    }

    res.status(200).json({ message: "Successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
