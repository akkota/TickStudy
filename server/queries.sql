CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email VARCHAR(219) NOT NULL,
	password VARCHAR(219) NOT NULL,
	refresh_token TEXT,
	study_time BIGINT
)

CREATE TABLE tasks (
	user_id INTEGER NOT NULL,
	task_title TEXT NOT NULL,
	priority VARCHAR(20),
	FOREIGN KEY (user_id) REFERENCES users(id)
)

CREATE TABLE studytime (
	user_id INTEGER NOT NULL,
	study_date DATE NOT NULL,
	study_time BIGINT,
	FOREIGN KEY (user_id) REFERENCES users(id)	
)

CREATE TABLE habits (
	user_id INTEGER NOT NULL,
	last_done DATE,
	streak INTEGER,
	FOREIGN KEY (user_id) REFERENCES users(id)
)

CREATE TABLE shop (
	user_id INTEGER NOT NULL,
	bronze_medal BOOLEAN NOT NULL,
	silver_medal BOOLEAN NOT NULL,
	gold_medal BOOLEAN NOT NULL,
	diamond_medal BOOLEAN NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
)

ALTER TABLE habits ADD COLUMN habit_name VARCHAR(300);
ALTER TABLE users ADD COLUMN coins INTEGER;