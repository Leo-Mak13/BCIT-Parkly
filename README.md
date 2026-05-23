# 🚗 Parkly: Find Parking at BCIT Downtown Campus

<p align="left">
  <img src="https://img.shields.io/badge/Type-Web%20App-ff6b6b?style=for-the-badge&logo=googlemaps&logoColor=white" />
  <img src="https://img.shields.io/badge/Language-TypeScript-00b4d8?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Framework-Express-9d4edd?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MySQL-2a9d8f?style=for-the-badge&logo=mysql&logoColor=white" />
</p>

**BCIT Parkly** is a CRUD web application project built to help students, staff, and visitors easily find and manage parking options at and around the BCIT Downtown Campus. It features an interactive map layout that tracks parking spot availability, shows live spot details, and handles simple spot reservations.

---

## 🖼️ System Storyboard

<table style="width: 100%; border-collapse: collapse; border: none;">
  <tr style="border: none;">
    <td align="center" style="border-bottom: 1px solid #333; border-right: 1px solid #333; padding: 20px; width: 50%;">
      <b>Account Registration Page</b><br><br>
      <img src="https://github.com/user-attachments/assets/e0653881-46b5-4e68-a531-8f9d855b2c63" width="400"><br><br>
    </td>
    <td align="center" style="border-bottom: 1px solid #333; padding: 20px; width: 50%;">
      <b>Sign In Authentication</b><br><br>
      <img src="https://github.com/user-attachments/assets/d4f1eead-f724-4074-baa7-50a000f02995" width="400"><br><br>
    </td>
  </tr>
  <tr style="border: none;">
    <td align="center" style="border-bottom: 1px solid #333; border-right: 1px solid #333; padding: 20px;">
      <b>Main Interactive Map Dashboard</b><br><br>
      <img src="https://github.com/user-attachments/assets/9f50ab9d-63b0-48ab-a310-f819d100a48d" width="400"><br><br>
    </td>
    <td align="center" style="border-bottom: 1px solid #333; padding: 20px;">
      <b>Parking Lot "Details" Side Panel</b><br><br>
      <img src="https://github.com/user-attachments/assets/75692df7-0e4f-4547-a200-9871e170f402" width="400"><br><br>
    </td>
  </tr>
  <tr style="border: none;">
    <td align="center" style="border-bottom: 1px solid #333; border-right: 1px solid #333; padding: 20px;">
      <b>Permit Specifications & Rate Schedules</b><br><br>
      <img src="https://github.com/user-attachments/assets/8a704bfa-62ea-4e34-a2c1-8c7512aba8e5" width="400"><br><br>
    </td>
    <td align="center" style="border-bottom: 1px solid #333; padding: 20px;">
      <b>My Active Reservations Portal (User Signed In)</b><br><br>
      <img src="https://github.com/user-attachments/assets/6cace417-b4a1-4570-ae21-716ba8b93f3c" width="400"><br><br>
    </td>
  </tr>
  <tr style="border: none;">
    <td align="center" style="border-right: 1px solid #333; padding: 20px;">
      <b>Help & Support Knowledgebase</b><br><br>
      <img src="https://github.com/user-attachments/assets/7a7b82c8-6c1b-4efc-a5fe-c1a1c1cf73e6" width="400"><br><br>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack & Core Libraries

**Core Framework & Language**
<p align="left">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square" />
  <img src="https://img.shields.io/badge/Express-MVC-000000?style=flat-square" />
</p>

**UI & Interactive Elements**
<p align="left">
  <img src="https://img.shields.io/badge/Google_Maps-API-4285F4?style=flat-square" />
  <img src="https://img.shields.io/badge/Street_View-Static-4285F4?style=flat-square" />
  <img src="https://img.shields.io/badge/EJS-Templates-b4ca65?style=flat-square" />
</p>

**Data & Security**
<p align="left">
  <img src="https://img.shields.io/badge/MySQL-Relational-4479A1?style=flat-square" />
  <img src="https://img.shields.io/badge/Lucia-Auth-5f57ff?style=flat-square" />
  <img src="https://img.shields.io/badge/Dotenv-Credentials-00b4d8?style=flat-square" />
</p>

---

## ✨ Key Features

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

### 5. Secure User Authentication & Identity Management

* **Lucia Auth Engine**: Handles account states utilizing a custom database-backed session storage design to maintain seamless user login sessions.
* **Cryptographic Hashing**: Safeguards sensitive credentials by passing user passwords through strong hashing functions before database insertion, protecting user identity data.
* **Persistent Cookie Verification**: Employs secure cookie configurations to retain authenticated states safely across multiple browser tabs and page navigation events.

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
├── .github/                # YAML files for GutHub workflows
├── database/               # Database initialization scripts and migrations
│
├── public/                 # Static assets served directly to the browser
│   ├── assets/             # Map markers, branding assets, and campus logos
│   ├── css/                # Page styles
│   └── js/
│       ├── details.js      # Compiled side-panel controller script
│       ├── details.ts
│       ├── map.js          # Compiled Google map script
│       └── map.ts       
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
├── database.ts             # Database layer pooling and connection initialization
├── .env                    
├── .gitignore              
├── tsconfig.json
├── package.json            
└── README.md               # You're here!

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

* [x] **Milestone 1**: Set up basic Express server routing and views
* [x] **Milestone 2**: Generate interactive map markers with data layouts
* [x] **Milestone 3**: Synced sidebar components with dynamic details side panel
* [x] **Milestone 4**: Implement Lucia Auth for user registration and login
* [x] **Milestone 5**: Hide API key details on server and resolve Street View permissions
* [x] **Milestone 6**: Implement functional reservation forms (create, view, and delete)

## 💡 Pro-Tips

### Activating Google Street View

If your side details panel opens cleanly but the lot photo box displays a gray warning page saying the request is unauthorized, your key is missing permissions. Log into your **Google Cloud Console**, go to **APIs & Services > Library**, search for `Street View Static API`, and click **Enable**. Give it a couple of minutes to sync, and your street views will display correctly!
