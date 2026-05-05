## Project Structure

```txt
BCIT-Parkly/
├── database/                              # Database logic
│   ├── database.ts                        # Connection pool (MySQL)
│   └── schema.sql                         # Table definitions
│
├── public/                                # Browser-side files
│   ├── css/                               # Styling
│   │   └── main.css
│   ├── js/                                # Compiled JS files for frontend
│   │   ├── map.js
│   │   └── map.ts
│   └── assets/                            # Images & logos
|
├── src/
│   ├── index.ts                           # Server entry point (app.listen)
│   ├── app.ts                             # Express config (middleware, routes setup)
│   │
│   ├── controllers/                       # Handling incoming requests (talks to services)
│   │   ├── userController.ts              # Login/Signup logic
│   │   ├── reservationController.ts       # Login/Signup logic
│   │   └── lotController.ts               # Logic for finding/filtering lots
│   │
│   ├── models/                            # Database tables (SQL queries)
│   │   ├── userModel.ts                   # for users
│   │   ├── reservationModel.ts            # for reservations
│   │   └── lotModel.ts                    # for parking lots
│   │
│   ├── routes/                            # API endpoints
│   │   ├── userRoutes.ts                  # /api/users
│   │   ├── reservationRoutes.ts           # /api/reservations
│   │   └── lotRoutes.ts                   # /api/lots
│   │
│   ├── services/                          # App business logic (talks to models)
│   │   ├── userService.ts
│   │   ├── reservationService.ts
│   │   └── lotService.ts
|   |
│   ├── middleware/                        # Authentication
│   │   └── authMiddleware.ts              # Checking JWT/Session tokens
│   │
│   ├── utils/
│   │
│   └── types/
│       └── user.d.ts
│
├── views/                                 # Rendered dynamic HTML pages
│   ├── main.ejs
│   ├── users.ejs
│   ├── reservations.ejs
│   ├── lots.ejs
│   └── login.ejs
│
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```
