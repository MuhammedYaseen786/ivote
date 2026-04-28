# iVOTE — Online Voting System
### Built with MERN Stack (MongoDB · Express · React · Node.js)

---

## 📁 Project Structure

```
ivote/
├── backend/        ← Node.js + Express API server
├── frontend/       ← React web app
└── README.md
```

---

## 🚀 Setup Guide (Step by Step — Beginner Friendly)

### STEP 1 — Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS version** (e.g. 20.x)
3. Install it — click Next → Next → Finish
4. Verify: open a terminal and type:
   ```
   node -v
   ```
   You should see something like `v20.x.x`

---

### STEP 2 — Create a Free MongoDB Database

1. Go to https://www.mongodb.com/atlas
2. Click **"Try Free"** → Sign up
3. Choose **Free tier (M0)** → Select any region → Create
4. Under **Security → Database Access**: Add a user
   - Username: `ivoteuser`
   - Password: something strong (save it!)
5. Under **Security → Network Access**: Click "Add IP Address" → "Allow Access from Anywhere"
6. Under **Deployment → Database**: Click **Connect** → **Drivers**
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://ivoteuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### STEP 3 — Configure the Backend

1. Open the `backend/` folder
2. Copy `.env.example` and rename it to `.env`
3. Edit `.env` and fill in your details:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://ivoteuser:YOURPASSWORD@cluster0.xxxxx.mongodb.net/ivote?retryWrites=true&w=majority
   JWT_SECRET=any_long_random_string_here
   ADMIN_PASSWORD=admin123
   ```
   > ⚠️ Replace `YOURPASSWORD` and the cluster URL with YOUR actual values

---

### STEP 4 — Install & Run the Backend

Open a terminal in the `backend/` folder and run:

```bash
npm install
npm run dev
```

✅ You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

> Keep this terminal open!

---

### STEP 5 — Install & Run the Frontend

Open a **second terminal** in the `frontend/` folder and run:

```bash
npm install
npm start
```

✅ Your browser will automatically open at:
```
http://localhost:3000
```

---

## 🔑 How to Use the App

### As Admin (first, do this):
1. Go to http://localhost:3000/admin
2. Password: `admin123` (or whatever you set in `.env`)
3. **Add candidates** — Name, Position, Party
4. **Register voters** — Name + a unique Voter ID (e.g. VTR-001, VTR-002)

### As Voter:
1. Go to http://localhost:3000
2. Enter your **Full Name** and **Voter ID**
3. Select a candidate and click **Confirm Vote**

### View Results:
- Go to http://localhost:3000/results
- Results auto-refresh every 10 seconds

---

## 🔗 All Pages

| Page | URL | Who uses it |
|------|-----|-------------|
| Login | http://localhost:3000/ | Voters |
| Vote | http://localhost:3000/vote | Voters (after login) |
| Thank You | http://localhost:3000/thankyou | After voting |
| Results | http://localhost:3000/results | Everyone |
| Admin | http://localhost:3000/admin | Admin only |

---

## 🔒 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/login | Voter login |
| GET | /api/auth/me | Get current voter |
| GET | /api/candidates | List all candidates |
| POST | /api/vote | Cast a vote |
| GET | /api/results | Live results |
| POST | /api/admin/candidates | Add candidate |
| DELETE | /api/admin/candidates/:id | Remove candidate |
| POST | /api/admin/voters | Register voter |
| GET | /api/admin/voters | List all voters |
| POST | /api/admin/election/toggle | Open/Close election |
| POST | /api/admin/reset | Reset all votes |

---

## ⚙️ Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (free cloud DB)
- **Auth**: JWT (JSON Web Tokens)
- **Fonts**: Syne + DM Sans (Google Fonts)

---

## 🛠 Troubleshooting

**"Cannot connect to MongoDB"**
→ Check your MONGO_URI in `.env`. Make sure you replaced the password correctly.

**"Port 5000 already in use"**
→ Change `PORT=5001` in `.env` and update `"proxy": "http://localhost:5001"` in frontend/package.json

**Frontend shows blank page**
→ Make sure backend is running first (Step 4), then start frontend (Step 5)

**Admin page says access denied**
→ Make sure ADMIN_PASSWORD in `.env` matches what you type in the admin login

---

Made with ❤️ | iVOTE Online Voting System
