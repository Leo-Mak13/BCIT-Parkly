## Project Structure

```txt
BCIT-Parkly/
├── database/
│   ├── database.ts                 # Connection pool logic (MySQL)
│   └── schema.sql                  # Table definitions
│
├── node_modules/
|
├── public/
│   ├── css/
│   │   └── main.css
│   ├── js/
│   │   ├── map.js
│   │   └── map.ts
│   └── img/
|
├── src/
│   ├── index.ts                    # Server entry point (app.listen)
│   ├── app.ts                      # Express config (middleware, routes setup)
│   │
│   ├── controllers/
│   │   ├── userController.ts       # Login/Signup logic
│   │   └── parkingController.ts    # Logic for finding/filtering lots
│   │
│   ├── models/
│   │   ├── userModel.ts            # SQL queries for users[cite: 2]
│   │   └── lotModel.ts             # SQL queries for parking spot availability
│   │
│   ├── routes/
│   │   ├── userRoutes.ts           # /api/users
│   │   ├── parkingRoutes.ts        # /api/lots
│   │   └── apiRoutes.ts            # Main router to combine everything
│   │
│   ├── middleware/
│   │   └── authMiddleware.ts       # Checking JWT/Session tokens
│   │
│   ├── utils/
│   │
│   └── types/
│       └── index.d.ts
│
├── views/
│   ├── main.ejs
│   ├── customers.ejs
│   ├── reservations.ejs
│   └── login.ejs
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```
