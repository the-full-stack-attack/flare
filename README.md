# Flare ☀️

  *Encourage Yourself to Get Out and Explore!*

  **Flare** is your go-to for discovering local events, tackling small life missions, and boosting your social confidence. Whether you’re shy, dealing with jitters, or just want more adventures, Flare is here to help you level up your social life.**

---

 ### Table of Contents 🔥
- [Flare ☀️](#flare-️)
    - [Table of Contents 🔥](#table-of-contents-)
    - [Key Features 🗝️](#key-features-️)
    - [Why Use Flare❓](#why-use-flare)
    - [Tech Stack 🤓](#tech-stack-)
    - [Install \& Setup 🛠️](#install--setup-️)
      - [Environment Variables \& Credentials](#environment-variables--credentials)
    - [Database Setup](#database-setup)
    - [Feature Breakdown](#feature-breakdown)
    - [Workers](#workers)
    - [**📈 Git Workflow for Teams:**](#-git-workflow-for-teams)


---
### Key Features 🗝️

- ***Daily/Weekly Tasks*** – Quick missions that encourage you to leave the house and collect fun points. 🌟
- ***Local Events*** – A curated list of events nearby to explore.
- ***AI Assistant*** – Friendly pep talks and coping strategies for social events, powered by Google Gemini. 🤖
- ***Real-Time Chat*** – Connect with others instantly in our chat rooms.
- ***Accountability & Gamification*** – Rack up achievements and show off your “Flares”!

---

### Why Use Flare❓

- ***Conquer Social Anxieties***: Get short, friendly advice on stepping out of your comfort zone.
- ***Make New Friends***: Chat, sign up for events, and see who else is going.
- ***Track Your Progress***: Earn badges, join new events, and watch your confidence grow.

---

### Tech Stack 🤓

| Category               | Technology                             |
| ---------------------|----------------------------------------- |
| Language             | TypeScript (ES6)                         |
| ****Frontend****     | React 19.x, TailwindCSS, Shadcn/UI, etc. |
| ****Backend****      | Node.js, Express.js, Socket.IO           |
| ****Database****     | MySQL (Sequelize ORM)                    |
| ****AI****           | Google Gemini API                        |
| ****Build****        | Webpack, Babel, ts-node, Jest (tests)    |
| ****Version Ctrl**** | Git, GitHub                              |

---

### Install & Setup 🛠️

   Before you get started, make sure you have:

   - ***Node.js**** (v16+ recommended)
   - ***npm**** (v8+ recommended) or ***yarn****
   - ***MySQL**** installed locally (or access to a remote MySQL server)

#### Environment Variables & Credentials

- ***Copy*** ***.env-example*** → create a new file named ***.env*** in the project root.
- ***Update**** the placeholders in ***.env**** with your own credentials:

```bash

DB_NAME=flare
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>
DB_HOST=localhost
DB_PORT=3306
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
SESSION_SECRET=<ANY_RANDOM_STRING>
DEVELOPMENT=true
SOCKET=false

```


### Database Setup

1. **Create the `flare` Database:**

   Log into MySQL and execute the following commands:
   ```sql
   CREATE DATABASE flare;
   ```

2. Verify your ***.env*** matches your DB credentials (**DB_USER**, **DB_PASSWORD**, etc.).

- *Start the Server**

   `npm run start`

   You should see:

   > Connection has been established to the 'flare' database.
   > Listening on http://localhost:4000
3. Seed the database:
   - npm run seed
   - npm run seedEvents
   > If you ever need to reseed the database follow these steps:
   > 1. Drop the flare database
   > 2. Recreate the flare database
   > 3. Start/Restart the server so the models are read
   > 4. Follow the seeding instructions

<br>

---

### Feature Breakdown:
1. **Events**
2. **AI Conversation**
3. **Event Chatrooms**
4. **Tasks:** Tasks can be used as extra motivation, or a reason, to get out of the house.  Tasks are meant to be completed the day they are assigned.  
Relevant Models: User, Task, & User_Task  
   1. Tasks have 2 main components, TaskDisplay and ChooseTask
      > - TaskDisplay displays on the Dashboard and Task views  
      > - ChooseTask displays on the Task view
   2. The components render conditionally on the Task view based on the user's current_task_id value:  
      > - A null current_task_id will render the ChooseTask component  
      > - A number current_task_id will render the TaskDisplay component  
       > - If the current_task_id is not null, the current task is retrieved from the database using the current_task_id (**See in Dashboard view useEffect hook**)
   3. Users can choose from 5 task categories: Fun, Active, Duo, Normal, and Rejection Therapy
   4. Tasks can be declared complete on the TaskDisplay component. This causes a number of changes in the database  
      **See changes on PATCH request to /api/task/complete in /src/server/routes/task.ts**
   5. Users can opt-out of tasks  
      **See changes on PATCH request to /api/task/optOut/:id in src/server/routes/task.ts**
   6. Users can choose a difficulty level for a task on the ChooseTask component
   7. Users can retry a task they previously opted out of with a retry button on the Task view  
    **See PATCH to /api/task/retry in src/server/routes/task.ts**
      > - This button sets the user's current_task_id to the desired task  
      > - The corresponding user_task opted_out column is switched to false  
      > - The user will opt out of there current task if they are currently assigned one  
   8. Users can compare their task progress to the previous week on the Task view
      > - User model has denormalized data to track tasks completed over the last 2 weeks  
      > - Number of tasks completed the current week is held on weekly_task_count  
      > - Number of tasks completed the previous week is held on last_week_task_count  
   9. Users can generate a custom task, which will send a prompt to the Gemini AI using GoogleGenerativeAI package (***To be continued***)
5. **Flares:** Flares are achievements that users can earn by using the Flare app
   
   Relevant Models: Flare, User_Flare, Notification, User_Notification
   1. Talk about the feature below

### **Workers:**
> The server has workers that are scheduled to perform tasks at certain times throughout the week.  

**Tasks Workers:** See **src/server/workers/tasks.ts**
   - Two workers are scheduled for task automation  
   - One worker is scheduled for midnight everyday for generating new tasks: resetTasks() and createTasks() are called in this worker  
   - Another worker is scheduled for midnight on Mondays for reassigning the values of the weekly task counts for each user: resetCounts() is called in this worker

---

### **📈 Git Workflow for Teams:**

1. Checkout to new branch
   - `git checkout -b <BRANCH NAME>`
2. Make changes and commit _(frequently)_
   - See `CONTRIBUTING.md` for commit message guidelines
3. Push to `origin <BRANCH>`
4. Create pull request to `<ORG>:<BRANCH>` from fork (origin to upstream)
5. Have at least two team members review your pull request
   - _Never merge your own pull request_
6. **✅ If Approved + Merged :**
   1. Checkout to your local `main`
   2. Delete your feature branch if no longer needed with
      - `git branch -d <BRANCH>`
   3. Pull changes from `upstream main`
   4. Push to `origin main`
   5. _Continue to Step 1_
7. **↩️ If Changes Requested:**
   1. Make changes on local (commit/push)
   2. _Continue to Step 5_

---
