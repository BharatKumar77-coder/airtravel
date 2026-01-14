# 🚀 Quick Start Guide

## Current Status: ✅ System Running

Your Flight Booking System is **LIVE** and running:
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:5173
- ✅ MongoDB Atlas: Connected

---

## 🎮 How to Test the Application

### 1. **Search for Flights**
1. Open http://localhost:5173 in your browser
2. You'll see wallet balance: **₹50,000**
3. Select cities:
   - **From**: Delhi (DEL)
   - **To**: Mumbai (BOM)
4. Click **"Search Flights"**
5. You'll see up to 10 available flights

### 2. **Book a Flight**
1. Click **"Book Now"** on any flight
2. Enter passenger name (e.g., "John Doe")
3. Review flight details and price
4. Click **"Confirm Booking"**
5. You'll get:
   - ✅ Booking confirmation
   - 🎫 Unique PNR
   - 📥 PDF download button

### 3. **Download PDF Ticket**
1. After booking, click **"Download Ticket (PDF)"**
2. PDF will open in new tab with:
   - Passenger name
   - Flight details
   - PNR number
   - Price paid
   - Booking date/time

### 4. **View Booking History**
1. Click **"Booking History"** button
2. See all your bookings
3. Each card has a download button
4. Click to re-download any ticket

### 5. **Test Dynamic Pricing** ⚡
1. Search for flights (DEL → BOM)
2. **Book the SAME flight 3 times quickly**:
   - 1st booking: Price = ₹2,500 (example)
   - 2nd booking: Price = ₹2,500
   - 3rd booking: **Price = ₹2,750** (10% surge! ⚡)
3. You'll see "Surge pricing applied" indicator
4. Wait 10+ minutes
5. Book again: Price resets to ₹2,500

---

## 🔧 Backend Is Already Fixed!

**✅ PDF Download Issue - FIXED!**

The download controller now properly:
- Finds bookings by PNR
- Serves PDF files correctly
- Handles errors gracefully

**Changes made**:
- Added `Booking` model import
- Changed from `getBookingHistory()` to `Booking.findOne({ pnr })`
- Fixed file path serving

**Restart backend** to apply changes:
```powershell
# Stop current backend (Ctrl+C in backend terminal)
# Then restart:
npm start
```

---

## 📊 Available Cities

- **DEL** - Delhi
- **BOM** - Mumbai
- **BLR** - Bangalore
- **HYD** - Hyderabad
- **MAA** - Chennai
- **CCU** - Kolkata
- **AMD** - Ahmedabad
- **PNQ** - Pune

---

## 💡 Tips

**Wallet Balance**: 
- Starts at ₹50,000
- Updates in real-time after each booking
- Shows warning if insufficient funds

**Dynamic Pricing**:
- Only applies to the **same flight** + **same user**
- Must be within **5 minutes** window
- Resets after **10 minutes** of inactivity

**PDF Tickets**:
- Saved in `backend/tickets/` folder
- Can be re-downloaded anytime
- Unique PNR for each booking

---

## 🎯 Next Steps (Optional)

Want to enhance the system? Add:
- [ ] User authentication (JWT)
- [ ] Email notifications
- [ ] Flight departure times
- [ ] Seat selection
- [ ] Payment gateway integration

---

## ⚠️ Troubleshooting

**PDF download not working?**
1. Restart backend server
2. Check `backend/tickets/` folder exists
3. Try booking a new flight

**Wallet not updating?**
- Refresh the page
- Check browser console for errors

**Can't see flights?**
- Make sure backend is running
- Check MongoDB connection
- Try re-seeding: `npm run seed`

---

Enjoy your Flight Booking System! ✈️
