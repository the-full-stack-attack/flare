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
