# 🚗 BCIT Parkly: Find Parking at BCIT Downtown Campus

**BCIT Parkly** is a CRUD web application project built to help students, staff, and visitors easily find and manage parking options at and around the BCIT Downtown Campus. It features an interactive map layout that tracks parking spot availability, shows live spot details, and handles simple spot reservations.

---

## 🛠️ Key Features

### 1. Interactive Map & Sidebar Synchronization

* **Map Markers**: Click on any marker on the Google Map to pop open a quick info summary window right above it.
* **Side Panel Details**: Cicking "Details" on either a map marker or a sidebar card slides out a deeper information panel without refreshing the page.
* **Seamless Clicks**: Uses direct element tracking so the application always opens the exact lot profile you clicked on, regardless of how the list is sorted.

### 2. Live Occupancy Progress Bars

* **Visual Spots Tracking**: Automatically computes open vs. filled spaces (`occupiedSpots = totalSpots - openSpots`) using the database payload.
* **Color-Coded Badges**: Color indicators transition seamlessly based on how full a lot currently is, using simple status rules (`Available`, `Limited`, or `Full`) to let you see spot statuses at a single glance.

### 3. Server-to-Client Data Bridge

* **Data Transmission**: Safely passes structured JSON lot arrays from the Node.js/Express server directly down into client-side scripts.
* **API Key Security**: Keeps your private cloud credentials like the `Maps_API_KEY` hidden safely behind server configurations, exposing only the key property to the window scope for client-side map loading.

### 4. Interactive Street View Preview

* **Visual Peek**: Connects to the Google Street View API to fetch real, point-of-view images of the target parking lot coordinates.
* **Built-in Fallbacks**: Uses customized lookup metrics (`radius=200` and `source=outdoor`) to make sure Google finds and shows the nearest outdoor road photo if the exact coordinates are slightly off-street.

---

## 📋 Interface Contracts

### ParkingLot Structure Definition

Parkly enforces structured typing to keep backend data and user interface components perfectly aligned:

```typescript
export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Schedule {
  daytimePrice: number;
  daytimeRate: string;
  eveningPrice: number;
  eveningRate: string;
  weekendPrice: number;
  weekendRate: string;
  rateUnit: string;
}

export interface ParkingLot {
  lotId: number;
  name: string;
  floor: number;
  type: "staff" | "student";
  capacity: number;
  schedule: Schedule;
  latitude: number;
  longitude: number;
  address: Address;
  validPermits: Array<string>;
  description?: string;
  availability: "Available" | "Limited" | "Full";
  openSpots: number;
}

```

---

## 🏗️ Technical Architecture

The application is structured into clear, separate code layers to make code troubleshooting and maintenance straightforward:

* **`main.ejs`**: The main template layout file. It serves as the visual landing page, sets up target HTML containers, and passes initial data over to client scripts.
* **`js/map.ts`**: Coordinates the Google Maps platform configurations, places markers onto the screen, and renders the hover/popup elements.
* **`js/details.ts`**: Manages the slide-out side panel layout, builds the visual progress bars, fills in textual prices, and processes outgoing reservation parameters.

---

## 📁 Project Layout

```txt
BCIT-Parkly/
├── .github/                # GitHub workflows and automation actions
├── database/               # Database initialization scripts and migrations
├── public/                 # Static assets served directly to the browser
│   ├── assets/             # Map markers, branding assets, and campus logos
│   ├── css/
│   │   └── main.css        # Layouts, slide animations, and side-panel styles
│   └── js/
│       ├── details.js      # Compiled side-panel controller script
│       └── map.js          # Compiled Google Maps rendering module
│
├── src/                    # Main TypeScript source development directory
│   ├── controllers/        # Route controllers parsing requests and responses
│   ├── middleware/         # Authentication and request validation guards
│   ├── models/             # Schema specifications and database data models
│   ├── routes/             # Express API path definitions and router splitting
│   ├── services/           # Core business logic processing and helper layers
│   ├── types/              # Centralized TypeScript interface contracts
│   └── app.ts              # Core server configuration and initialization entry point
│
├── tests/                  # Integration testing modules and test suites
├── views/                  # Embedded JavaScript (EJS) server-side layouts
│   └── main.ejs            # Main map dashboard template layout
│
├── .env                    # Protected local environment credentials config
├── .gitignore              # Tracking rules configuration for repository security
├── database.ts             # Database layer pooling and connection initialization
├── package.json            # Manifest file managing project scripts and dependencies
└── README.md               # Documentation landing page

```

---

## 🚀 Quick Start

1. **Clone and setup dependencies:**

```bash
git clone https://github.com/Leo-Mak13/BCIT-Parkly
cd BCIT-Parkly
npm install

```

2. **Configure Environment Variables:** Create a new file named `.env` in the root folder and add your Google Cloud credentials:

```env
PORT=3000
GOOGLE_MAPS_API_KEY=AIzaSyYourActualSecureCloudPlatformKeyHere
GOOGLE_MAP_ID=your_custom_vector_map_style_id

```

3. **Launch the app locally:**

```bash
npm run dev

```

---

## 📈 Roadmap

* [x] **Milestone 1**: Set up basic Express server routing and views.
* [x] **Milestone 2**: Generate interactive map markers with data layouts.
* [x] **Milestone 3**: Synced sidebar components with dynamic details side panel.
* [x] **Milestone 4**: Hide API key details on server and resolve Street View permissions.
* [x] **Milestone 5**: Implement functional reservation forms (create, view, and delete).

## 💡 Pro-Tips

### Activating Google Street View

If your side details panel opens cleanly but the lot photo box displays a gray warning page saying the request is unauthorized, your key is missing permissions. Log into your **Google Cloud Console**, go to **APIs & Services > Library**, search for `Street View Static API`, and click **Enable**. Give it a couple of minutes to sync, and your street views will display correctly!
