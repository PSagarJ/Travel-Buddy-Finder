# TravelBuddy ✈️

TravelBuddy is a comprehensive, full-stack web application built on the MERN stack. Designed for modern explorers, it allows users to discover trip itineraries, apply to join travel groups, collaborate via real-time chat, and seamlessly log and split shared travel expenses using an automated **Settlement Minimization Engine**.

---

## 🌟 Core Features

* 🔐 **Secure Session Authentication:** Dynamic user registration and login management utilizing `localStorage` session states to seamlessly track unique traveler profiles across views.
* 💼 **Dual-Role Control Deck:** An identity-aware Creator Dashboard that splits user views into two secure access matrices:
* **Trips You Are Hosting:** Granting administrative controls to review, approve, or reject incoming applicant crew requests.
* **Trips You Are Joining:** Granting a clean view-only space to keep tabs on upcoming itineraries with quick access to shared group tools.


* 💰 **Live Debt Minimization Ledger:** A dynamic expense manager connected directly to a persistent database. It calculates global trip costs, divides shares dynamically among approved crew members, and executes an optimization algorithm to output immediate settlement instructions (*Who owes how much to whom*).
* 💬 **Real-Time Logistics Chat:** Instantly initialized chat rooms powered by Socket.io, restricting communications strictly to verified trip crew members for coordinated logistics.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| --- | --- | --- |
| **Frontend** | React.js (Vite) | Single Page Application framework with declarative state management. |
| **Routing** | React Router v6 | Client-side declarative routing and dynamic URL parameter parsing. |
| **Backend** | Node.js & Express.js | Event-driven runtime server layer executing non-blocking REST API routing. |
| **Database** | MongoDB & Mongoose | Document-based NoSQL database utilizing structural schemas and data validation models. |
| **Sockets** | Socket.io | Bidirectional low-latency WebSocket layer running real-time event-driven relays. |
| **HTTP Client** | Axios | Promise-based networking layer linking state triggers to backend routers. |

---

## 📂 Project Architecture

```text
travel-buddy-finder/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── components/         # Shared UI components (Navbar, etc.)
│   │   ├── pages/              # View components (Home, Dashboard, BudgetSplitter, etc.)
│   │   ├── App.jsx             # Client-side router mappings
│   │   └── main.jsx
├── server/                     # Backend Express Server Environment
│   ├── src/
│   │   ├── controllers/        # Logical endpoint functions (tripController, expenseController)
│   │   ├── models/             # Mongoose database collection blueprints (User, Trip, Expense)
│   │   └── routes/             # REST API endpoint route bindings
│   └── server.js               # Application core mounting middleware, sockets, & db configurations

```

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js installed globally on your machine.
* MongoDB Community Server or MongoDB Atlas instance active.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/travel-buddy-finder.git
cd travel-buddy-finder

```

### 2. Configure Backend Server Environment

Navigate into the server folder and install dependencies:

```bash
cd server
npm install

```

Create a `.env` configuration file in the root of the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelbuddy

```

Boot up the development backend server using nodemon:

```bash
npm run dev

```

### 3. Configure Frontend Client Environment

Open a secondary terminal instance, navigate to the client folder, and install dependencies:

```bash
cd client
npm install

```

Start the Vite development web environment:

```bash
npm run dev

```

Open your web browser and navigate to `http://localhost:5173` to interact with the application locally!

---

## 🔌 API Endpoints Documentation

### Authentication Routes (`/api/auth`)

* `POST /api/auth/register` - Registers a new user account profile into the database.
* `POST /api/auth/login` - Validates access credentials and initializes a user profile session.

### Trip Operational Routes (`/api/trips`)

* `POST /api/trips` - Commits a brand-new group travel itinerary to the public board.
* `GET /api/trips` - Fetches all active trip itineraries sorted chronologically.
* `GET /api/trips/:id` - Extracts deep data details for a targeted trip document.
* `GET /api/trips/user/:userId` - Fetches all hosted and joined trips connected to a user session.
* `POST /api/trips/:id/apply` - Pushes a user profile ID to a trip's pending applicants queue.
* `PUT /api/trips/:id/status` - Processes an applicant's entry status (Approve / Reject) and modifies approved crew lists.
* `DELETE /api/trips/:id` - Removes a trip document entirely, restricted via owner validation.

### Financial Management Routes (`/api/expenses`)

* `POST /api/expenses` - Registers a single expense payload securely down into MongoDB.
* `GET /api/expenses/:tripId` - Retrieves a chronological transaction history linked to a specific travel crew.

---

> 📝 **Development Note:** Malformed test records or data entries created under early schemas can cause local rendering issues. Use a database management utility like **MongoDB Compass** to drop the `trips`, `users`, and `expenses` collections if you need to test the end-to-end user authentication and enrollment flows from a clean slate.
