# IronForm — Gym Application (Full Stack)

A gym membership application: **Node.js + Express** backend, **MongoDB** database, and a **Bootstrap 5 + jQuery** frontend that talks to the backend over a REST API. All content (programs, trainers, plans, gallery, testimonials) is stored in MongoDB and rendered dynamically — nothing is hardcoded in the HTML.

## Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT + bcrypt (member accounts, admin-protected routes)
- **Frontend:** HTML5, CSS3, Bootstrap 5, jQuery, vanilla JS (for counters/animations)

## Project structure
```
gym-app/
├── server/
│   ├── server.js            # Express app entry point
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # Mongoose schemas
│   ├── controllers/         # Route handlers / business logic
│   ├── routes/               # Express routers
│   ├── middleware/           # auth (JWT) + error handling
│   └── seed/seed.js          # populates MongoDB with starting content
├── public/
│   ├── index.html            # Bootstrap 5 markup, empty data containers
│   ├── css/style.css         # theme layered on top of Bootstrap
│   └── js/app.js             # jQuery: AJAX calls, rendering, auth, forms
├── package.json
└── .env.example
```

## Setup

**1. Install dependencies**
```bash
npm install
```

**2. Configure environment**
```bash
cp .env.example .env
```
Edit `.env`:
```
MONGODB_URI=mongodb://127.0.0.1:27017/ironform   # or an Atlas connection string
PORT=5000
JWT_SECRET=some-long-random-string
JWT_EXPIRES_IN=7d
```

**3. Make sure MongoDB is reachable**
- Local: install MongoDB Community Server and make sure `mongod` is running, or
- Cloud: create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) and paste its connection string into `MONGODB_URI`.

**4. Seed the database** (creates programs, trainers, plans, gallery, testimonials, and a default admin)
```bash
npm run seed
```
This prints a default admin login: `admin@ironform.gym` / `admin123` — **change this password** after first login (there's no UI for it yet; update it directly in MongoDB or add a "change password" endpoint).

**5. Run the app**
```bash
npm run dev     # with nodemon, auto-restarts on changes
# or
npm start
```
Visit **http://localhost:5000** — Express serves both the API and the frontend from the same server, so there's no separate frontend server or CORS to configure.

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/programs` | — | List workout programs |
| GET | `/api/trainers` | — | List trainers |
| GET | `/api/plans` | — | List membership plans |
| GET | `/api/gallery` | — | List gallery images |
| GET | `/api/testimonials` | — | List member reviews |
| POST | `/api/bookings` | — | Submit a free-trial booking (`name`, `email`, `date`, `time`, `goal`) |
| GET | `/api/bookings` | admin | View all bookings |
| POST | `/api/contact` | — | Submit a contact message (`name`, `email`, `phone`, `message`) |
| GET | `/api/contact` | admin | View all contact messages |
| POST | `/api/auth/register` | — | Create a member account, returns a JWT |
| POST | `/api/auth/login` | — | Log in, returns a JWT |
| GET | `/api/auth/me` | member+ | Get the logged-in user's profile |

Admin-only routes expect `Authorization: Bearer <token>` from a user whose `role` is `admin` (the seed script creates one such account).

## How the frontend works
`public/js/app.js` uses jQuery's `$.ajax`/`$.get`/`$.post`-style calls to:
- fetch programs/trainers/plans/gallery/testimonials from the API and inject them into the Bootstrap grid on page load
- validate and submit the **free trial booking** and **contact** forms straight to MongoDB via the API, using Bootstrap's `is-invalid` styling for errors
- handle **register/login/logout** through Bootstrap modals, storing the JWT in `localStorage` and swapping the navbar between guest and logged-in states
- run the dark/light theme toggle, animated stat counters, and scroll-reveal animations (plain JS/`IntersectionObserver`, since jQuery doesn't add value there)

Membership plans render as literal barbell weight plates that grow with the tier (Basic → Standard → Premium) — this is pulled from the `Plan` collection, not hardcoded, so editing prices/benefits only requires updating MongoDB (or re-running the seed script with new data).

## Extending it
- **Deployment:** frontend + backend ship together (Express serves `public/`), so you only need one host — Render, Railway, or a VPS all work. Point `MONGODB_URI` at Atlas in production.
- **Admin dashboard:** the `GET /api/bookings` and `GET /api/contact` routes are ready for an admin UI; there isn't one built yet.
- **Payments, class schedule, nutrition plans, AI recommendations:** none of these are built — they were "bonus" ideas in the original brief and would each need their own model/routes/UI.
