# TickStudy
### Frontend
![HTML5](https://img.shields.io/badge/HTML5-000000?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-000000?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript&logoColor=white)
![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-000000?style=for-the-badge&logo=tailwind-css&logoColor=white)
### Backend
![Node.js](https://img.shields.io/badge/Node.js-000000?style=for-the-badge&logo=node.js&logoColor=339933)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
### Datastore
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql&logoColor=white)
# Description

**TickStudy**: A Study Application That Helps Students Be More Productive! Includes a Study Timer, Todo-Lists, Habit Tracker, and Study Statistics

This application offers several tools that aim to support students' needs. The goal is to provide the user with all the tools that help them track how well and consistenly they work. The following tools are included in TickStudy: 

 - Regular Timer and Pomodoro Timer
 - Statistics Dashboard (Hours studied, Graphs, Streaks)
 - Task List
 - Habit Tracker

# Running TickStudy

## Requirements
To use TickStudy, you will need the following:
- **[Node.js](https://nodejs.org/en) version 20 or higher** (used to run the backend)
- **[PostgreSQL](https://www.postgresql.org/download/) 16 or higher** (used to store user data)
- **[Visual Studio Code](https://code.visualstudio.com/updates/v1_92) version 1.92 or higher** (Highly Recommended, especially for beginners)

## Starting The App

You can download the latest release of the application from the releases page. 

### Initial Setup

You first need to launch pgAdmin after downloading PostgreSQL. Leave the user as is (postgres) and the port as the default port. These steps are **not required but highly recommended**. First create a database named "studyapp" (not required but highly recommended). Then open the queries.sql file in the server folder and execute all scripts inside the studyapp database. 

### Run the application 

Open the project files in VSCode. Run the following script in both the client and server folders using the terminal: 
```
 npm i
```

Now we need to add a .env file in the server folder for the database to work correctly. The .env file must contain the following variables (**pay attention to capitalization**): 

 - ACCESS_TOKEN_SECRET (set this to a random string of 60 characters or greater)
 - REFRESH_TOKEN_SECRET (set this to a random string of 60 characters or greater)
 - PG_USER (set this to whatever you named your user while signing up, the default is "postgres")
 - PG_HOST (set this to localhost)
 - PG_DATABASE (set this to what you named the database. This should be studyapp, if you followed my instructions above)
 - PG_PASSWORD (set this to the password you created upon signing up on pgAdmin)
 - PG_PORT (set this to your database port. The default is 5432)

Afterwards, in only the server folder, run the following command: 
```
 nodemon server.js
```
Then, in only the client folder, run the following command: 
```
 npm run dev
```

If you visit the URL: [http://localhost:5173](http://localhost:5173), the application should be up and running!

### Stopping the application
Enter the terminal windows of your client and server and run `Ctrl + C` to terminate the process.
