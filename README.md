# ✈️ Flight Booking System

A production-ready flight booking system with dynamic pricing, wallet management, and PDF ticket generation. Built for an internship technical assignment showcasing clean architecture and professional code quality.

## 🎯 Features

- **Flight Search**: Search flights between Indian cities with real-time results
- **Dynamic Pricing Engine**: 
  - Tracks booking attempts per flight/user
  - 10% price surge after 3 booking attempts within 5 minutes
  - Automatic price reset to base price after 10 minutes
- **Wallet System**: 
  - Default balance: ₹50,000
  - Real-time balance updates
  - Insufficient balance validation
- **PDF Ticket Generation**: 
  - Professional PDF tickets with all flight details
  - Unique PNR for each booking
  - Download and re-download capability
- **Booking History**: View all past bookings with download options

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **PDF Generation**: PDFKit
- **ID Generation**: NanoID

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API

## 📁 Project Structure

```
flight-booking-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models
│   │   ├── services/        # Business logic layer
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Error handling, validation
│   │   ├── utils/           # Helper functions
│   │   └── app.js           # Express application
│   ├── seed/                # Database seeder
│   ├── tickets/             # Generated PDF tickets
│   ├── .env                 # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/           # Page components
    │   ├── components/      # Reusable components
    │   ├── context/         # Context API state
    │   ├── services/        # API functions
    │   └── App.jsx          # Main app component
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote connection)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file (or use the existing one):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flight-booking
   NODE_ENV=development
   DEFAULT_USER_ID=default_user
   DEFAULT_WALLET_BALANCE=50000
   ```

4. **Seed the database**:
   ```bash
   npm run seed
   ```
   This will create 20 flights with realistic data.

5. **Start the backend server**:
   ```bash
   npm start
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Search Flights
```http
GET /api/flights?from=DEL&to=BOM
```

**Query Parameters**:
- `from` (required): Departure city code (e.g., DEL, BOM, BLR)
- `to` (required): Arrival city code

**Response**:
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "flight_id": "IN1000",
      "airline": "IndiGo",
      "departure_city": "DEL",
      "arrival_city": "BOM",
      "base_price": 2500,
      "current_price": 2500,
      "last_price_update": "2026-01-13T07:15:08.000Z"
    }
  ]
}
```

#### 2. Create Booking
```http
POST /api/book
```

**Request Body**:
```json
{
  "user_id": "default_user",
  "passenger_name": "John Doe",
  "flight_id": "IN1000"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "booking_id": "abc123def456",
    "pnr": "A1B2C3",
    "passenger_name": "John Doe",
    "flight_id": "IN1000",
    "final_price": 2750,
    "booked_at": "2026-01-13T07:20:00.000Z",
    "pdf_download": "/api/download/A1B2C3",
    "surge_applied": true
  }
}
```

#### 3. Get Booking History
```http
GET /api/bookings?user_id=default_user
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "booking_id": "abc123def456",
      "pnr": "A1B2C3",
      "passenger_name": "John Doe",
      "flight_id": "IN1000",
      "final_price": 2750,
      "booked_at": "2026-01-13T07:20:00.000Z",
      "pdf_path": "..."
    }
  ]
}
```

#### 4. Get Wallet Balance
```http
GET /api/wallet/:user_id
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user_id": "default_user",
    "balance": 47250
  }
}
```

#### 5. Download Ticket
```http
GET /api/download/:pnr
```

Downloads the PDF ticket for the given PNR.

## ⚡ Dynamic Pricing Logic

The pricing engine implements surge pricing based on booking attempts:

### How It Works

1. **Tracking**: Every booking attempt is recorded with:
   - Flight ID
   - User ID
   - Timestamp

2. **Surge Trigger**: 
   - If a user attempts to book the **same flight** **3 times** within **5 minutes**
   - The price increases by **10%** on the 3rd attempt

3. **Price Reset**:
   - If **10 minutes** pass since the last price update
   - Price automatically resets to `base_price`

### Example Scenario

```
Initial price: ₹2,500

12:00 PM - Attempt 1: Price = ₹2,500
12:02 PM - Attempt 2: Price = ₹2,500
12:04 PM - Attempt 3: Price = ₹2,750 (surge applied! +10%)
12:15 PM - Attempt 4: Price = ₹2,500 (reset after 10 minutes)
```

### Implementation Details

- All pricing logic is in `/backend/src/services/pricingService.js`
- Uses MongoDB queries to track attempts efficiently
- Atomic operations to prevent race conditions

## 💳 Wallet System

- Each user starts with ₹50,000
- Balance is deducted only after successful booking
- Transactional updates prevent double-spending
- Real-time balance display on frontend

## 📄 PDF Ticket Details

Generated tickets include:
- ✅ Passenger Name
- ✅ Airline Name
- ✅ Flight ID
- ✅ Route (Departure → Arrival)
- ✅ Final Price Paid
- ✅ Booking Date & Time
- ✅ Unique PNR

PDFs are:
- Generated using PDFKit
- Stored in `/backend/tickets/`
- Re-downloadable at any time

## 🎨 Frontend Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Modern UI**: TailwindCSS with custom components
- **Smooth Navigation**: React Router with clean URLs

### Available Routes

- `/` - Flight Search Page
- `/booking` - Booking Confirmation Page
- `/history` - Booking History Page

## 🧪 Testing the Application

### 1. Test Flight Search
```bash
curl "http://localhost:5000/api/flights?from=DEL&to=BOM"
```

### 2. Test Dynamic Pricing
Make 3 booking attempts for the same flight within 5 minutes:
```bash
# Attempt 1
curl -X POST http://localhost:5000/api/book \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test_user","passenger_name":"Test1","flight_id":"IN1000"}'

# Attempt 2 (wait 1-2 minutes)
curl -X POST http://localhost:5000/api/book \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test_user","passenger_name":"Test2","flight_id":"IN1000"}'

# Attempt 3 (price should increase by 10%)
curl -X POST http://localhost:5000/api/book \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test_user","passenger_name":"Test3","flight_id":"IN1000"}'
```

### 3. Test Wallet Validation
Try booking a flight when balance is insufficient:
- Book flights until balance is low
- Attempt booking with price > balance
- Should receive error message

### 4. Test PDF Generation
1. Create a booking
2. Check `/backend/tickets/` for generated PDF
3. Download via `/api/download/:pnr`

## 🏗️ Architecture Highlights

### MVC + Service Layer

✅ **Controllers**: Thin request handlers  
✅ **Services**: All business logic  
✅ **Models**: Database schema & validation  
✅ **Routes**: API endpoint definitions

### No Prohibited Practices

❌ No static JSON data  
❌ No external APIs  
❌ No business logic in controllers  
❌ No hard-coded values  
❌ No console.log in production

### Best Practices

✅ Centralized error handling  
✅ Request validation middleware  
✅ Atomic database operations  
✅ Proper HTTP status codes  
✅ Clean, modular code  
✅ Meaningful commit messages

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/flight-booking` |
| `NODE_ENV` | Environment mode | `development` |
| `DEFAULT_USER_ID` | Default user identifier | `default_user` |
| `DEFAULT_WALLET_BALANCE` | Initial wallet balance | `50000` |

## 🔮 Future Enhancements (Optional)

- [ ] User Authentication (JWT)
- [ ] Email notifications
- [ ] Flight schedules & departure times
- [ ] Seat selection
- [ ] Multiple payment methods
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Production deployment (Vercel + MongoDB Atlas)

## 📄 License

This project is created for educational/internship purposes.

## 👤 Author

Created as part of a technical internship assignment demonstrating:
- Clean architecture
- Production-ready code
- Professional development practices
- Full-stack development skills

---

**Note**: Make sure MongoDB is running before starting the backend server!
