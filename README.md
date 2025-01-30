# flare

## Database Setup

1. **Create the `flare` Database:**

   Log into MySQL and execute the following commands:

   ```sql
   CREATE DATABASE flare;

   ```
2. **Environment Variables & Credentials**

   Make sure you have a **.env** file (copied from **.env-example**) in your project root with the following variables:

```bash
DB_NAME=flare
DB_USER=<YOUR_DB_USER>
DB_PASSWORD=<YOUR_DB_PASSWORD>
DB_HOST=localhost
DB_PORT=3306
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=
GEMINI_API_KEY=<YOUR_GOOGLE_GEMINI_KEY>
DEVELOPMENT=true
SOCKET=false
```

3. **Start the Server**

   `npm run start`

  You should see:

> Connection has been established to the 'flare' database.
> Listening on http://localhost:4000

---

### **📈 Git Workflow for Teams:**

1. Checkout to new branch
   > `git checkout -b <BRANCH NAME>`
   >
2. Make changes and commit _(frequently)_
   > See `CONTRIBUTING.md` for commit message guidelines
   >
3. Push to `origin <BRANCH>`
4. Create pull request to `<ORG>:<BRANCH>` from fork (origin to upstream)
5. Have at least two team members review your pull request
   > _Never merge your own pull request_
   >
6. **✅ If Approved + Merged :**
   1. Checkout to your local `main`
   2. Delete your feature branch if no longer needed with
      > `git branch -d <BRANCH>`
      >
   3. Pull changes from `upstream main`
   4. Push to `origin main`
   5. _Continue to Step 1_
7. **↩️ If Changes Requested:**
   1. Make changes on local (commit/push)
   2. _Continue to Step 5_

---
### **Features:**
1. **Events**
2. **AI Conversation**
3. **Event Chatrooms**
4. **Tasks:** Tasks can be used as extra motivation, or a reason, to get out of the house.  Tasks are meant to be completed the day they are assigned.  
Relevant Models: User, Task, & User_Task  
   1. Tasks have 2 main components, TaskDisplay and ChooseTask
      > TaskDisplay displays on the Dashboard and Task views  
      > ChooseTask displays on the Task view
   2. The components render conditionally on the Task view based on the user's current_task_id value:  
      > A null current_task_id will render the ChooseTask component  
      > A number current_task_id will render the TaskDisplay component
      * If the current_task_id is not null, the current task is retrieved from the database using the current_task_id (**See in Dashboard view useEffect hook**)
   3. Users can choose from 5 task categories: Fun, Active, Duo, Normal, and Rejection Therapy
   4. Tasks can be declared complete on the TaskDisplay component. This causes a number of changes in the database
      > **See changes on PATCH request to /api/task/complete in /src/server/routes/task.ts**
   5. Users can opt-out of tasks
      > **See changes on PATCH request to /api/task/optOut/:id in src/server/routes/task.ts**
   6. Users can choose a difficulty level for a task on the ChooseTask component
   7. Users can retry a task they previously opted out of with a retry button on the Task view
      > This button sets the user's current_task_id to the desired task  
      > The corresponding user_task opted_out column is switched to false  
      > **See PATCH to /api/task/retry in src/server/routes/task.ts**
   8. Users can compare their task progress to the previous week on the Task view
      > User model has denormalized data to track tasks completed over the last 2 weeks  
      > Number of tasks completed the current week is held on weekly_task_count  
      > Number of tasks completed the previous week is held on last_week_task_count  
   9. Users can generate a custom task, which will send a prompt to the Gemini AI using GoogleGenerativeAI package (***To be continued***)

### **Workers:**
   The server has workers that are scheduled to perform tasks at certain times throughout the week.  
   - **Tasks Workers:** See **src/server/workers/tasks.ts**
      > Two workers are scheduled for task automation  
      > One worker is scheduled for midnight everyday for generating new tasks: resetTasks() and createTasks() are called in this worker  
     > Another worker is scheduled for midnight on Mondays for reassigning the values of the weekly task counts for each user: resetCounts() is called in this worker