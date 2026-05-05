## Project Structure

```txt
BCIT-Parkly/
├── public/               # Browser-side files (The "Front-end")
│   ├── img/              # Images & logos
│   ├── main.css          # General styles for the main page
│   ├── map.ts            # Google maps logic & sidebar toggle logic
│   └── map.js            # Compiled JS (the file the browser actually reads)
│
├── src/                  # Server-side files (The "Back-end")
│   └── main.ts           # Express server setup
│
├── views/                # HTML Templates
│   └── main.ejs          # Homepage structure
│
├── package.json
├── tsconfig.json
└── .gitignore
```
