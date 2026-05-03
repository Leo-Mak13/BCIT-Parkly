```txt
BCIT-Parkly/
├── public/               # Browser-side files (The "Front-end")
│   ├── main.css          # General styles (Map height, reset)
│   ├── sidebar.css       # UBC-style sidebar & card styles (New!)
│   ├── map.ts            # Google Maps logic & Sidebar toggle logic
│   └── map.js            # Compiled JS (The file the browser actually reads)
│
├── src/                  # Server-side files (The "Back-end")
│   └── main.ts           # Express server setup & routes
│
├── views/                # HTML Templates
│   └── main.ejs          # Your main page structure (Map + Sidebar HTML)
│
├── package.json
├── tsconfig.json
└── .gitignore
```
